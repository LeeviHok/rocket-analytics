import json
import os

import boto3


class SecretsManager:
    def __init__(self):
        self._region = os.environ['AWS_REGION']
        self._session = boto3.session.Session()
        self._client = self._session.client(
            service_name='secretsmanager',
            region_name=self._region,
        )

    def get_secret(self, name):
        response = self._client.get_secret_value(SecretId=name)
        return json.loads(response['SecretString'])
