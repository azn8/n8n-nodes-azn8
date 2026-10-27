import type { INodeProperties } from 'n8n-workflow';

export const activityDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['activity'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get recent listing activity',
				description: 'Get the newest added, updated, and restored events on live listings',
				routing: {
					request: { method: 'GET', url: '/api/v1/activity' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'activity' } }] },
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['activity'], operation: ['getAll'] } },
		typeOptions: { minValue: 1, maxValue: 50 },
		default: 50,
		description: 'Max number of results to return',
		routing: { send: { type: 'query', property: 'limit' } },
	},
];
