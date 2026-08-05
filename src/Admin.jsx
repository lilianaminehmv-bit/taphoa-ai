import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import imageCompression from "browser-image-compression";
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
function removeVietnameseTones(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function Admin({ setReload }) {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchAdmin, setSearchAdmin] = useState("");

  useEffect(() => {
  loadProducts();
}, []);

function editProduct(item){

  setEditId(item.id);

  setName(item.name);

  setPrice(item.price);

  setCategory(item.category);

  setIsEdit(true);

}

async function deleteProduct(id){
    if(!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")){
  return;
}

  console.log("ID cần xóa:", id);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);


  if(error){
    console.log("Lỗi xóa:", error);
    alert("Xóa thất bại");
    return;
  }


  alert("Đã xóa sản phẩm");

  loadProducts();

}


async function loadProducts(){

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });


  if(error){
    console.log("Lỗi tải sản phẩm:", error);
    return;
  }


  setProducts(data);

}

  async function uploadImage() {

  if (!image) {
    return null;
  }

  const options = {
  maxSizeMB: 0.4,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

const compressedFile = await imageCompression(image, options);

const formData = new FormData();

formData.append("file", compressedFile);
formData.append("upload_preset", uploadPreset);


  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );


  const data = await res.json();

  return data.secure_url;
}

  async function saveProduct() {
    if (isEdit) {

  const { error } = await supabase
    .from("products")
    .update({
      name: name,
      price: Number(price),
      category: category
    })
    .eq("id", editId);


  if(error){
    console.log("Lỗi cập nhật:", error);
    alert("Cập nhật thất bại");
    return;
  }

  


  alert("Đã cập nhật sản phẩm");

  setIsEdit(false);
  setEditId(null);

  setName("");
  setPrice("");
  setCategory("");

  loadProducts();

setReload(prev => !prev);

return;

}
    const imageUrl = await uploadImage();
    console.log("Link ảnh:", imageUrl);

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: name,
          price: Number(price),
          category: category,
          image_url: imageUrl
        }
      ]);

    if (error) {
      console.log("Lỗi lưu:", error);
      alert("Lưu thất bại");
      return;
    }

    console.log("Đã lưu:", data);
    alert("Đã thêm sản phẩm");

setReload(prev => !prev);

setName("");
setPrice("");
setCategory("");

  }


  return (
    <div className="admin-panel">

      <h2>Thêm sản phẩm</h2>

      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />


      <input
        type="number"
        placeholder="Giá"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />


      <input
        type="text"
        placeholder="Danh mục"
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
      />
      <input
  type="file"
  accept="image/*"
  onChange={(e)=>setImage(e.target.files[0])}
/>


   {
  !isEdit && (
    <button onClick={saveProduct}>
      Lưu sản phẩm
    </button>
  )
}


{
  isEdit && (
    <div className="edit-buttons">

      <button onClick={saveProduct}>
        Cập nhật sản phẩm
      </button>


      <button
        onClick={()=>{
          setIsEdit(false);
          setEditId(null);
          setName("");
          setPrice("");
          setCategory("");
        }}
      >
        Hủy sửa
      </button>

    </div>
  )
}

      <hr />


<h3>Danh sách sản phẩm</h3>

<input
  type="text"
  placeholder="🔍 Tìm sản phẩm..."
  value={searchAdmin}
  onChange={(e)=>setSearchAdmin(e.target.value)}
/>

<div className="product-list">
{
products
.filter((item)=>
  removeVietnameseTones(item.name)
  .includes(removeVietnameseTones(searchAdmin))
)
.map((item)=>( 
       <div className="admin-product" key={item.id}>

      <div>
        <b>{item.name}</b>
        <br />
        {Number(item.price).toLocaleString()}đ
      </div>


      <div>

        <button
  onClick={()=>editProduct(item)}
>
  ✏️
</button>


        <button
          onClick={()=>deleteProduct(item.id)}
        >
          🗑
        </button>

      </div>

    </div>
  ))
}
        </div>
  </div>
  );
}

export default Admin;