import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

export const UPDATE_PRODUCT = (id,data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${base_url}/api/admin/products/${id}`, data,{
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};