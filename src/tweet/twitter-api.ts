import got, { Response } from 'got/dist/source';

export interface TweetDetails {
  /* eslint-disable camelcase */
  created_at: Date;
  id: number;
  text: string;
  /* eslint-enable camelcase */
}

export interface UserDetails {
  /* eslint-disable camelcase */
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  pinned_tweet_id: string;
  username: string;
  url: string;
  name: string;
  id: string;
  created_at: Date;
  protected: boolean;
  profile_image_url: string;
  verified: boolean;
  description: string;
  /* eslint-enable camelcase */
}

export class TwitterApi {
  private static readonly API_URL: string = 'https://api.twitter.com/2';

  private static readonly API_BEARER_TOKEN: string = process.env.TWITTER_BEARER_TOKEN;

  /**
   * Get the details of a twitter user.
   * @param username The Twitter username.
   */
  public static async getUserDetails(username: string): Promise<UserDetails> {
    return got(
      `${this.API_URL}/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${this.API_BEARER_TOKEN}`,
        },
        responseType: 'json',
        searchParams: {
          'user.fields': 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld',
        },
      },
    ).then((response: Response<any>) => {
      response.body.data.created_at = new Date(response.body.data.created_at);
      return response.body.data as UserDetails;
    });
  }

  /**
   * Get 10 most recent tweets of a user.
   * @param userId The user ID number (not username).
   */
  public static async getUserTimeline(userId: number): Promise<TweetDetails[]> {
    return got(
      `${this.API_URL}/users/${userId}/tweets`,
      {
        headers: {
          Authorization: `Bearer ${this.API_BEARER_TOKEN}`,
        },
        responseType: 'json',
        searchParams: {
          exclude: 'replies,retweets',
          'tweet.fields': 'created_at,id,text',
        },
      },
    ).then((response: Response<any>) => {
      for (let i = 0; i < response.body.data.length; i += 1) {
        response.body.data[i].created_at = new Date(response.body.data[i].created_at);
      }
      return response.body.data as TweetDetails[];
    });
  }
}
