import { BaseAuthAccountInfo } from "@t/auth";
import { GitHub as GithubInstance } from "arctic";

const clientId = process.env.GITHUB_CLIENT_ID!;
const clientSecret = process.env.GITHUB_CLIENT_SECRET!;

const github = new GithubInstance(clientId, clientSecret, null);

const authUrl = (state: string) =>
  github.createAuthorizationURL(state, ["read:user", "user:email"]);

const getTokens = async (code: string) =>
  github.validateAuthorizationCode(code);

const getAccount = async (
  accessToken: string
): Promise<BaseAuthAccountInfo> => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user: GitHubResponse = await response.json();
  if (!user || !user.email || !user.name || !user.avatar_url) {
    throw new Error("The user does not have an email address.");
  }

  return {
    id: user.id.toString(),
    username: user.name,
    email: user.email,
    iconUrl: user.avatar_url,
  };
};

interface GitHubResponse {
  login: string; // Username
  id: number; // User ID
  node_id: string; // Node ID for the user
  avatar_url: string; // URL to the user's avatar
  gravatar_id: string; // Gravatar ID (usually empty)
  url: string; // API URL for the user
  html_url: string; // GitHub profile URL
  followers_url: string; // URL to the user's followers
  following_url: string; // URL to the users the user is following
  gists_url: string; // URL to the user's gists
  starred_url: string; // URL to the user's starred repositories
  subscriptions_url: string; // URL to the user's subscriptions
  organizations_url: string; // URL to the user's organizations
  repos_url: string; // URL to the user's repositories
  events_url: string; // URL to the user's events
  received_events_url: string; // URL to the events received by the user
  type: string; // Type of the user (User, Organization, etc.)
  site_admin: boolean; // Is the user a site administrator?
  name: string; // Name of the user
  company: string | null; // Company name or null
  blog: string; // User's blog URL
  location: string | null; // Location or null
  email: string | null; // Email address or null
  hireable: boolean; // Is the user hireable?
  bio: string | null; // Bio or null
  twitter_username: string | null; // Twitter username or null
  public_repos: number; // Count of public repositories
  public_gists: number; // Count of public gists
  followers: number; // Count of followers
  following: number; // Count of users the user is following
  created_at: string; // Creation date
  updated_at: string; // Last update date
  private_gists: number; // Count of private gists
  total_private_repos: number; // Count of total private repositories
  owned_private_repos: number; // Count of owned private repositories
  disk_usage: number; // Disk usage
  collaborators: number; // Count of collaborators
  two_factor_authentication: boolean; // Is two-factor authentication enabled?
  plan: {
    name: string; // Name of the plan
    space: number; // Space allocated
    private_repos: number; // Number of private repositories allowed
    collaborators: number; // Number of collaborators allowed
  };
}

export {
  github,
  authUrl as githubAuthUrl,
  getAccount as getGithubAccount,
  getTokens as getGithubTokens,
};
