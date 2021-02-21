import { useMutation, useQuery } from 'react-query';
import useApiRequest from '../useRequest';

/**
 * Authentication invite accept.
 */
export const useAuthInviteAccept = (props) => {
  const apiRequest = useApiRequest();

  return useMutation(
    ([values, token]) => apiRequest.post(`invite/accept/${token}`, values),
    props,
  )
}

/**
 * Retrieve the invite meta by the given token.
 * @param {string} token - Token.
 */
export const useInviteMetaByToken = (token, props) => {
  const apiRequest = useApiRequest();

  return useQuery(
    ['INVITE_META', token],
    () => apiRequest.get(`invite/invited/${token}`),
    {
      select: (res) => res.data,
      ...props
    }
  );
}