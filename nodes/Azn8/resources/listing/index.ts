import type {
	DeclarativeRestApiSettings,
	IExecutePaginationFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { categoryOptions, listingFields, listingSlug, pricingOptions } from '../../shared';

const show = (operation: string[]) => ({ show: { resource: ['listing'], operation } });

const PAGE_SIZE = 50;
const MAX_PAGES = 200;

/** AZN8 paginates with ?page=N&limit=50. Keeps every filter and stops on a short page. */
async function paginateListings(
	this: IExecutePaginationFunctions,
	requestOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const results: INodeExecutionData[] = [];
	for (let page = 1; page <= MAX_PAGES; page++) {
		requestOptions.options.qs = { ...(requestOptions.options.qs ?? {}), page, limit: PAGE_SIZE };
		const items = await this.makeRoutingRequest(requestOptions);
		results.push(...items);
		if (items.length < PAGE_SIZE) break;
	}
	return results;
}

const listPagination = (operation: string): INodeProperties[] => [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: show([operation]),
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
				type: 'query',
				property: 'limit',
				value: '50',
			},
			operations: {
				pagination: paginateListings,
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['listing'], operation: [operation], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 50 },
		default: 50,
		description: 'Max number of results to return',
		routing: {
			send: { type: 'query', property: 'limit' },
			output: { maxResults: '={{$value}}' },
		},
	},
];

export const listingDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['listing'] } },
		options: [
			{
				name: 'Archive or Restore',
				value: 'setStatus',
				action: 'Archive or restore a listing',
				description: 'Archive one of your listings, or restore an archived one',
				routing: {
					request: {
						method: 'POST',
						url: '=/api/v1/listings/{{encodeURIComponent($parameter.slug)}}',
					},
				},
			},
			{
				name: 'Create or Update',
				value: 'create',
				action: 'Create or update a listing',
				description:
					'Submit a product to the AZN8 directory. Listings go live right away. Submitting the same website again updates your existing listing.',
				routing: {
					request: { method: 'POST', url: '/api/v1/listings' },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a listing',
				description:
					'Permanently delete one of your listings. This frees its slug and website and cannot be undone.',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/api/v1/listings/{{encodeURIComponent($parameter.slug)}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a listing',
				description: 'Get a live listing by its slug',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v1/listings/{{encodeURIComponent($parameter.slug)}}',
					},
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'listing' } }] },
				},
			},
			{
				name: 'Get Alternatives',
				value: 'getAlternatives',
				action: 'Get alternatives to a listing',
				description: 'Get up to 24 ranked live listings that share a category with a listing',
				routing: {
					request: {
						method: 'GET',
						url: '=/api/v1/listings/{{encodeURIComponent($parameter.slug)}}/alternatives',
					},
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'alternatives' } }],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Search listings',
				description: 'Search and filter live listings in the directory',
				routing: {
					request: { method: 'GET', url: '/api/v1/listings' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'listings' } }] },
				},
			},
			{
				name: 'Get My Listings',
				value: 'getMine',
				action: 'Get my listings',
				description: 'Get the listings owned by the account of the API key, in any status',
				routing: {
					request: { method: 'GET', url: '/api/v1/listings', qs: { mine: '1' } },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'listings' } }] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a listing',
				description: 'Edit one of your listings in place. Fields you leave out stay unchanged.',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v1/listings/{{encodeURIComponent($parameter.slug)}}',
					},
				},
			},
		],
		default: 'getAll',
	},

	// Slug based operations
	{
		...listingSlug,
		displayOptions: show(['delete', 'get', 'getAlternatives', 'update', 'setStatus']),
	},

	// Archive or Restore
	{
		displayName: 'Action',
		name: 'statusAction',
		type: 'options',
		displayOptions: show(['setStatus']),
		options: [
			{
				name: 'Archive',
				value: 'archive',
				description: 'Hide the listing from the public directory',
			},
			{ name: 'Restore', value: 'restore', description: 'Make an archived listing live again' },
		],
		default: 'archive',
		routing: { send: { type: 'body', property: 'action' } },
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		displayOptions: show(['setStatus']),
		default: '',
		description: 'Optional note stored with the status change',
		routing: { send: { type: 'body', property: 'reason', value: '={{ $value || undefined }}' } },
	},

	// Create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: show(['create']),
		default: '',
		description: 'Product name, up to 80 characters. Used to generate the listing slug.',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Website URL',
		name: 'websiteUrl',
		type: 'string',
		required: true,
		displayOptions: show(['create']),
		default: '',
		placeholder: 'https://example.com',
		description: 'Product website, up to 500 characters',
		routing: { send: { type: 'body', property: 'website_url' } },
	},
	{
		displayName: 'Tagline',
		name: 'tagline',
		type: 'string',
		required: true,
		displayOptions: show(['create']),
		default: '',
		description: 'One-line pitch, up to 160 characters',
		routing: { send: { type: 'body', property: 'tagline' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: show(['create']),
		default: {},
		options: listingFields(false),
	},

	// Update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: show(['update']),
		default: {},
		options: listingFields(true),
	},

	// Get Many
	...listPagination('getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: show(['getAll']),
		default: {},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'options',
				options: categoryOptions,
				default: 'saas',
				routing: { send: { type: 'query', property: 'category' } },
			},
			{
				displayName: 'Pricing Model',
				name: 'pricing',
				type: 'options',
				options: pricingOptions,
				default: 'free',
				routing: { send: { type: 'query', property: 'pricing' } },
			},
			{
				displayName: 'Search Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Text to search for in listing names, taglines, and descriptions',
				routing: { send: { type: 'query', property: 'q' } },
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Name', value: 'name' },
					{ name: 'Newest', value: 'newest' },
				],
				default: 'newest',
				routing: { send: { type: 'query', property: 'sort' } },
			},
		],
	},

	// Get My Listings
	...listPagination('getMine'),
];
