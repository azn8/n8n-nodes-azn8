import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Azn8Api implements ICredentialType {
	name = 'azn8Api';

	displayName = 'AZN8 API';

	icon: Icon = { light: 'file:../icons/azn8.svg', dark: 'file:../icons/azn8.dark.svg' };

	documentationUrl = 'https://azn8.com/docs/agents#2-mint-an-api-key';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your AZN8 API key (starts with azn8_). Create a free account at azn8.com, verify your email, then mint a key from your dashboard or with POST /api/v1/api-keys.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://azn8.com',
			description: 'Leave as is unless you run a self-hosted AZN8 instance',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl || "https://azn8.com"}}',
			url: '/api/v1/listings',
			method: 'GET',
			qs: {
				mine: '1',
				limit: 1,
			},
		},
	};
}
