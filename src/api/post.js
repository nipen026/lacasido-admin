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
      .post(`${base_url}products/addProduct`, data,{
                headers: { 'Content-Type': 'multipart/form-data' }
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
export const ADD_BANNER = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}banner/upload`, data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};