import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

const show = { show: { resource: ['directory'], operation: ['getAll'] } };

const CATALOG_LISTS = ['live', 'submitted', 'pending', 'failed'];

/** Flattens the catalog's live[], submitted[], pending[], failed[] arrays into one item per directory. */
async function flattenCatalog(
	this: IExecuteSingleFunctions,
	_items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const body = (response.body ?? {}) as IDataObject;
	const returnAll = this.getNodeParameter('returnAll', false) as boolean;
	const limit = returnAll ? 0 : (this.getNodeParameter('limit', 50) as number);
	const out: INodeExecutionData[] = [];
	for (const list of CATALOG_LISTS) {
		const rows = body[list];
		if (!Array.isArray(rows)) continue;
		for (const row of rows as IDataObject[]) {
			out.push({ json: { catalog_list: list, ...row } });
			if (limit && out.length >= limit) return out;
		}
	}
	return out;
}

const flag = (displayName: string, name: string, description: string): INodeProperties => ({
	displayName,
	name,
	type: 'boolean',
	default: true,
	description,
	routing: {
		send: { type: 'query', property: name, value: '={{ $value ? "1" : undefined }}' },
	},
});

export const directoryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['directory'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get free directories to submit to',
				description:
					'Get the AZN8 catalog of free SaaS and AI directories, with auth, pricing, badge, captcha, and dofollow details for each',
				routing: {
					request: { method: 'GET', url: '/agent-directories.json' },
					output: { postReceive: [flattenCatalog] },
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: show,
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: { resource: ['directory'], operation: ['getAll'], returnAll: [false] },
		},
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'multiOptions',
		options: [
			{ name: 'Failed', value: 'failed' },
			{ name: 'Live', value: 'live' },
			{ name: 'Pending', value: 'pending' },
			{ name: 'Submitted', value: 'submitted' },
		],
		default: ['live'],
		description: 'Which catalog lists to return. Live directories are publicly verified.',
		displayOptions: show,
		routing: {
			send: { type: 'query', property: 'status', value: '={{ $value.join(",") }}' },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: show,
		default: {},
		options: [
			flag(
				'Agent Friendly Only',
				'agent_friendly',
				'Whether to return only free directories with no badge or backlink, no OAuth-only sign-in, no phone or work email, and no hard captcha',
			),
			flag('Has API Only', 'api', 'Whether to return only directories with a submission API'),
			flag('Instant Only', 'instant', 'Whether to return only directories that publish instantly'),
			flag(
				'No Account Needed',
				'no_account',
				'Whether to return only directories that need no account',
			),
			flag(
				'No Badge Required',
				'no_badge',
				'Whether to return only directories that need no badge or backlink',
			),
			flag('No Captcha', 'no_captcha', 'Whether to return only directories without a captcha'),
		],
	},
];
