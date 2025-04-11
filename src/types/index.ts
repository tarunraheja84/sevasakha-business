export interface Business {
    id: string;
    profilePhoto: string;
    businessName: string;
    category: string;
    address: string;
    contactNo: string;
    googleLocation: string;
    description: string;
    images: string[];
    videos: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type BusinessFormData = Omit<Business, 'id' | 'createdAt' | 'updatedAt'>;
  
  export interface ElasticsearchResponse {
    hits: {
      total: {
        value: number;
      };
      hits: Array<{
        _id: string;
        _source: Omit<Business, 'id'>;
      }>;
    };
  }