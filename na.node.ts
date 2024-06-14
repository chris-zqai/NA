import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class N-Able implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'N-Able',
        name: 'nAble',
        icon: 'file:nAble.png',
        group: ['transform'],
        version: 1,
        description: 'Interact with N-Able API',
        defaults: {
            name: 'N-Able',
            color: '#1F72E6',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'JWT Token',
                name: 'jwtToken',
                type: 'string',
                default: '',
                placeholder: 'Your JWT Token',
                description: 'The JWT token for authentication',
                required: true,
            },
            {
                displayName: 'Endpoint',
                name: 'endpoint',
                type: 'string',
                default: '',
                placeholder: 'API Endpoint',
                description: 'The API endpoint to call',
                required: true,
            },
            {
                displayName: 'Method',
                name: 'method',
                type: 'options',
                options: [
                    {
                        name: 'GET',
                        value: 'GET',
                    },
                    {
                        name: 'POST',
                        value: 'POST',
                    },
                    // Add other methods if needed
                ],
                default: 'GET',
                description: 'The HTTP method to use',
                required: true,
            },
            {
                displayName: 'Body',
                name: 'body',
                type: 'json',
                default: '',
                placeholder: '{"key": "value"}',
                description: 'The JSON body for POST requests',
                displayOptions: {
                    show: {
                        method: [
                            'POST',
                        ],
                    },
                },
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const jwtToken = this.getNodeParameter('jwtToken', i) as string;
            const endpoint = this.getNodeParameter('endpoint', i) as string;
            const method = this.getNodeParameter('method', i) as string;
            const body = this.getNodeParameter('body', i) as string;

            const options = {
                method,
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: method === 'POST' ? JSON.stringify(JSON.parse(body)) : undefined,
            };

            const response = await this.helpers.httpRequest({
                url: `https://your-n-central-instance/${endpoint}`,
                ...options,
            });

            returnData.push({
                json: response,
            });
        }

        return [returnData];
    }
}
