# api-permissionless - Environment Configuration and Commands

## Environment Variables

### Public Environment Variables (Client-Side)

- **`NEXT_PUBLIC_SITE_URL`**: The URL of the hosted website.
- **`NEXT_PUBLIC_AMOUNT_PER_URL_TRACKING`**: The number of RPLAY tokens awarded per generated URL.
- **`NEXT_PUBLIC_TREASURE_WALLET`**: The wallet address that will receive these tokens.
- **`NEXT_PUBLIC_ENVIRONMENT`**: Specifies the environment type, either `dev` or `production`.
- **`NEXT_PUBLIC_RPLAY_CONTRACT_ADDRESS`**: The address of the RPLAY smart contract.

### Private Environment Variables (Server-Side)

- **`PRIVATE_KEY`**: The private key of the wallet used to interact with the smart contract on the Camp Network.
- **`VIDEOS_CONTRACT_ADDRESS`**: The address of the published smart contract on the Camp Network.
- **`REPLAY_ADMIN_TOKEN`**: The token used to authenticate with the Replay API.
- **`DATABASE_URL`**: The MongoDB URI where information about URLs listed in the "My URLs" tab is stored.

## Running the Project Locally

1. Install dependencies:
   ```bash
   pnpm i
   ```

2. Start the development server:
   ```bash
   pnpm run dev
   ```

## Building the Project

1. Build the application:
   ```bash
   pnpm run build
   ```

