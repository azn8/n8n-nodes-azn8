import type { INodeProperties } from 'n8n-workflow';

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get the current account',
				description: 'Get the AZN8 account that the API key belongs to',
				routing: {
					request: { method: 'GET', url: '/api/v1/account' },
				},
			},
		],
		default: 'get',
	},
];
