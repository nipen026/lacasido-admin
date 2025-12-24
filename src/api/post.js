import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token')


export const REGISTER = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}auth/register`, data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const LOGIN = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}/api/admin-login`, data)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const ADD_PRODUCT = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}/api/admin/products`, data,{
                headers: { 'Content-Type': 'multipart/form-data',Authorization:`Bearer ${token}` }
            })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const ADD_REVIEW = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}reviews/create`, data,{
                headers: { 'Content-Type': 'multipart/form-data' ,Authorization:`Bearer ${token}`}
            })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const ADD_COUPON = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}coupons/create`, data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const ADD_CATEGORY = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}/api/admin/categories`, data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const ADD_DROPDOWN = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}/api/admin/dropdowns`, data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};