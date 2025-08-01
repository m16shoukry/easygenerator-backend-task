export class BaseApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}
export default BaseApiResponse;
