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
export const GET_CONTACT_US = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}/api/admin/contact-us`,{
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
      .get(`${base_url}/api/admin/inquiries`,{
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
export const GET_CATEGORY = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}/api/categories`,{
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
export const GET_DROPDOWNS = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}/api/dropdowns`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const GET_DROPDOWNS_BY_TYPE = (type) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${base_url}/api/dropdowns/type/${type}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};