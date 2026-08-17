import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  clientId: "gaTFpEk4xShkCJL83QlVFZXGbMKyogzA",
  clientSecret: "DICdPIhyCCZFYLM0cCYEhkj3Bn_0t2cT6MBk8k-llR9xDT3pta6g95RlxBBVl0hj",
 
  secret: "THIS_IS_A_LONG_RANDOM_STRING_AT_LEAST_32_CHARS"
});