import axios from 'axios';
import { Input } from 'enquirer';
import { LocalStorage } from 'node-localstorage';
import qs from 'query-string';

const codePrompt = new Input({
  message: 'Please enter code from redirecter url: ',
});
const getDocsPermissionsMask = (base = 0) => base + (1 << 17);
const CLIENT_ID = process.env.NX_VK_CLIENT_ID;
const CLIENT_SECRET = process.env.NX_VK_SECRET_ID;
const REDIRECT_URL = 'https://localhost';
function getAuthorizationQuery(): string {
  const queryParams = qs.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    display: 'page',
    scope: getDocsPermissionsMask(),
    response_type: 'code',
    state: 'some_state',
  });
  return `https://oauth.vk.com/authorize?${queryParams}`;
}

async function exchangeCode(code: string): Promise<string> {
  const { data } = await axios.get<{
    access_token: string;
    expires_in: number;
    user_id: number;
  }>(`https://oauth.vk.com/access_token`, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URL,
      code: code,
    },
    timeout: 3 * 1000,
  });
  console.log('data', data);
  return data.access_token;
}

const TOKEN_KEY = 'ACCESS_TOKEN';

const store = new LocalStorage('./tmp/local_storage');

const getTokenFromStorage = (): string | null => {
  const token: string | null = store.getItem(TOKEN_KEY);
  return token;
};

const setTokenFromStorage = (token: string) => {
  store.setItem(TOKEN_KEY, token);
};

async function getAccessToken() {
  const authUrl = getAuthorizationQuery();

  console.log(`Please go to ${authUrl} and authorize app`);
  const code = await codePrompt.run();
  const accessToken = await exchangeCode(code);
  console.log({ accessToken });
  return accessToken;
}
export async function authorizeVk(): Promise<string> {
  let token = getTokenFromStorage();

  if (!token) {
    token = await getAccessToken();
    setTokenFromStorage(token);
  }

  return token;
}
