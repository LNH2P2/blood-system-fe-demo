import { District, Province, Ward } from '@/types/address';

const BASE_URL = 'https://provinces.open-api.vn/api';

export const addressApi = {
  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${BASE_URL}/p/`);
      if (!response.ok) throw new Error('Failed to fetch provinces');
      return await response.json();
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  },

  async getDistricts(provinceCode: number): Promise<District[]> {
    try {
      const response = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
      if (!response.ok) throw new Error('Failed to fetch districts');
      const data: Province = await response.json();
      return data.districts || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  },

  async getWards(districtCode: number): Promise<Ward[]> {
    try {
      const response = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`);
      if (!response.ok) throw new Error('Failed to fetch wards');
      const data: District = await response.json();
      return data.wards || [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      return [];
    }
  },
};
