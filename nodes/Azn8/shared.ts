import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

export const categoryOptions: INodePropertyOptions[] = [
	{ name: 'AI', value: 'ai' },
	{ name: 'Analytics', value: 'analytics' },
	{ name: 'Customer Support', value: 'customer-support' },
	{ name: 'Design', value: 'design' },
	{ name: 'Developer Tools', value: 'developer-tools' },
	{ name: 'Domains', value: 'domains' },
	{ name: 'Education', value: 'education' },
	{ name: 'Finance', value: 'finance' },
	{ name: 'Marketing', value: 'marketing' },
	{ name: 'Marketplace', value: 'marketplace' },
	{ name: 'No-Code', value: 'no-code' },
	{ name: 'Other', value: 'other' },
	{ name: 'Productivity', value: 'productivity' },
	{ name: 'Sales', value: 'sales' },
	{ name: 'SaaS', value: 'saas' },
	{ name: 'Security', value: 'security' },
];

export const pricingOptions: INodePropertyOptions[] = [
	{ name: 'Contact', value: 'contact' },
	{ name: 'Free', value: 'free' },
	{ name: 'Freemium', value: 'freemium' },
	{ name: 'One-Time', value: 'one-time' },
	{ name: 'Subscription', value: 'subscription' },
	{ name: 'Usage-Based', value: 'usage' },
];

export const listingSlug: INodeProperties = {
	displayName: 'Listing Slug',
	name: 'slug',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'e.g. my-product',
	description:
		'The URL slug of the listing, as in https://azn8.com/listing/{slug}. Returned as "slug" by the Create and Get Many operations.',
};

const splitLines = '={{ String($value).split(/\\r?\\n|,/).map((s) => s.trim()).filter((s) => s) }}';

/** Optional listing fields shared by Create and Update. */
export function listingFields(includeCore: boolean): INodeProperties[] {
	const fields: INodeProperties[] = [];
	if (includeCore) {
		fields.push(
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Product name, up to 80 characters',
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Tagline',
				name: 'tagline',
				type: 'string',
				default: '',
				description: 'One-line pitch, up to 160 characters',
				routing: { send: { type: 'body', property: 'tagline' } },
			},
			{
				displayName: 'Website URL',
				name: 'website_url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com',
				description: 'Product website, up to 500 characters',
				routing: { send: { type: 'body', property: 'website_url' } },
			},
		);
	}
	fields.push(
		{
			displayName: 'Categories',
			name: 'categories',
			type: 'multiOptions',
			options: categoryOptions,
			default: [],
			description: 'Up to 5 categories',
			routing: { send: { type: 'body', property: 'categories' } },
		},
		{
			displayName: 'Call to Action Label',
			name: 'cta_label',
			type: 'string',
			default: '',
			description:
				'Primary button label on the listing page, up to 40 characters. Empty falls back to "Visit website".',
			routing: { send: { type: 'body', property: 'cta_label' } },
		},
		{
			displayName: 'Description',
			name: 'description',
			type: 'string',
			typeOptions: { rows: 5 },
			default: '',
			description: 'Longer description, up to 4000 characters',
			routing: { send: { type: 'body', property: 'description' } },
		},
		{
			displayName: 'Features',
			name: 'features',
			type: 'string',
			typeOptions: { rows: 4 },
			default: '',
			description:
				'Key features, one per line or comma-separated. Up to 8 features of 120 characters each.',
			routing: { send: { type: 'body', property: 'features', value: splitLines } },
		},
		{
			displayName: 'Pricing Model',
			name: 'pricing_model',
			type: 'options',
			options: pricingOptions,
			default: 'free',
			routing: { send: { type: 'body', property: 'pricing_model' } },
		},
		{
			displayName: 'Pricing Summary',
			name: 'pricing_summary',
			type: 'string',
			default: '',
			placeholder: 'e.g. Free plan, Pro from $9/mo',
			description: 'Short pricing summary, up to 80 characters',
			routing: { send: { type: 'body', property: 'pricing_summary' } },
		},
	);
	return fields;
}
