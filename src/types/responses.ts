export interface BaseResponse {
  isSuccessful: boolean;
  errorMessage: string | null;
  errorCode: number;
}

export interface PromptResponse extends BaseResponse {
  projectId: number;
}

export interface ProjectDeleteResponse extends BaseResponse {
  projectId: number;
}

export type Project = {
  id : number;
  title : string;
  status : string;
  creatorId : string;
  audioUrl : string;
  videoUrl : string;
  ttsUrl? : string;
  prompt? : string;
  captionsUrl? : string;
}
export type BackgroundVideo = {
  id: number;
  url: string;
  previewUrl: string;
  posterUrl: string;
  urlHighQuality: string;
  description: string;
  category: string;
}

export interface ProjectReponse extends BaseResponse {
  projectData: Project
}

export interface ProjectsReponse extends BaseResponse {
  projectsData: Project[]
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

export interface ServiceBackgroundVideosResponse extends BaseResponse {
  serviceData: BackgroundVideo[];
}