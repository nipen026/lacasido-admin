import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('token')

export const GET_PRODUCT = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}/api/products`)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_ORDERS = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}orders/admin/all`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_USERS = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}auth/admin/getAllUsers`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_DASHBOARD = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}admin/dashboard/getAllDashboardData`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_PRODUCT_BY_ID = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}products/getProductById/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_ORDER_SUMMARY = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}orders/getOrderSummary`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_BANNER = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}banner/active`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_REVIEW = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}reviews/getAllreview`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_COUPON = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}coupons/getAllCoupon`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};