export interface BaseResponse {
  isSuccessful: boolean;
  errorMessage: string | null;
  errorCode: number;
}

export type ServiceFile = {
  id: number;
  url: string;
  type: number;
  title?: string;
  description?: string;
};
export interface ServiceResponse extends BaseResponse {
  serviceData: ServiceFile[];
}
