import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;


export const DELETE_PRODUCT = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${base_url}/api/admin/products/${id}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const DELETE_CATEGORY = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${base_url}/api/admin/categories/${id}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export const DELETE_DROPDOWN = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${base_url}/api/admin/dropdowns/${id}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};