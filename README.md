##
PM4ME - is a simple process manager

Warning: It is work-in-progress, not for production use.

## How to use

You need to create a configuration file (default name is ``pm4me.json``) defining running services.

Example:

```json
{
  "services": [
    {
      "name": "FE Admin",
      "script": "yarn frontend-admin"
    },
    {
      "name": "FE Mobile",
      "script": "yarn frontend-hcpmobile"
    },
    {
      "name": "API Main",
      "script": "yarn api-main"
    },
    {
      "name": "API Documents",
      "script": "yarn api-documents"
    },
    {
      "name": "API Payments",
      "script": "yarn api-payments"
    }
  ]
}
```

Fields for services:
* name - Generic name for the service
* script - Command running in the loop
* cwd - (Optional) Working directory
* restartAfter - Pause (in milliseconds) between restarting the app. Default - 3 seconds.

## Stay in touch

- Author - [Alexey Petushkov](https://www.linkedin.com/in/alexey-petushkov-7b441b2a/)

## License

Nest is [MIT licensed](LICENSE).
