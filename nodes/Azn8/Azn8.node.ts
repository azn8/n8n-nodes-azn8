import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { activityDescription } from './resources/activity';
import { directoryDescription } from './resources/directory';
import { listingDescription } from './resources/listing';

export class Azn8 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AZN8',
		name: 'azn8',
		icon: { light: 'file:../../icons/azn8.svg', dark: 'file:../../icons/azn8.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Search, submit, and manage listings on AZN8, the free SaaS, startup, and AI tool directory',
		defaults: {
			name: 'AZN8',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'azn8Api',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl || "https://azn8.com"}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': 'n8n-nodes-azn8',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Activity',
						value: 'activity',
					},
					{
						name: 'Directory Catalog',
						value: 'directory',
					},
					{
						name: 'Listing',
						value: 'listing',
					},
				],
				default: 'listing',
			},
			...listingDescription,
			...directoryDescription,
			...activityDescription,
			...accountDescription,
		],
	};
}
