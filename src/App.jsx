import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Admin from "./Admin";
import "./App.css";


function removeVietnameseTones(str = "") {

  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

}



function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [reload, setReload] = useState(false);


  const [products, setProducts] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("Tất cả");

  const [showAll, setShowAll] = useState(false);





  useEffect(() => {
  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("Lỗi tải dữ liệu:", error);
      return;
    }

   console.log("Dữ liệu Supabase:", data);
setProducts(data);
  }

  loadProducts();
}, [reload]);







  const categories = [

    "Tất cả",

    "Đồ ăn uống",

    "Đồ gốm sứ",

    "Đồ gia dụng",

    "Đồ điện",

    "Khác"

  ];







  const result = products.filter(item=>{


    const keyword = removeVietnameseTones(search);



    const name = removeVietnameseTones(item.name);



    const cat = removeVietnameseTones(item.category);




    const matchSearch =


      name.includes(keyword)

      ||

      cat.includes(keyword);






    const matchCategory =


      category === "Tất cả"

      ||

      item.category === category;






    return matchSearch && matchCategory;



  });









  const displayProducts = showAll

    ? result

    : result.slice(0,3);









    function checkAdminPassword(){

  if(password === "123456"){

    setShowAdmin(true);
    setShowLogin(false);
    setPassword("");

  }else{

    alert("Sai mật khẩu");

  }

}
  return (
  <>
   <button 
  className="admin-btn"
  onClick={() => {

    if(showAdmin){

      setShowAdmin(false);

    }else{

      setShowLogin(true);

    }

  }}
>
  ⚙️ Quản lý
</button>


    <div className="store">



    






      <header className="header">


        <h1>

          🛒 Tạp Hóa Ngọc Ấn

        </h1>


        <p>

          Giá có thể thay đổi theo thời điểm

        </p>


      </header>







      <input

        className="search"

        placeholder="🔍 Tìm sản phẩm..."

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

      />








      <div className="categories">


        {

          categories.map((item,index)=>(


            <button

              key={index}

              onClick={()=>{

                setCategory(item);

                setShowAll(false);

              }}

            >

              {item}

            </button>


          ))

        }


      </div>








      <p className="count">

        Có {result.length} sản phẩm

      </p>









      <div className="products">


        {

          displayProducts.map((item,index)=>(



<div
  className="card"
  key={index}
  onClick={() => console.log("Click vào card")}
>

              {
  item.image_url &&
  <img
  src={item.image_url}
  alt={item.name}
  onClick={() => {
    console.log("Đã bấm ảnh");
    setPreviewImage(item.image_url);
  }}
  style={{ cursor: "pointer" }}
/>
}




              <h3>

                {item.name}

              </h3>





              <span className="category-text">

                {item.category}

              </span>





              <p className="price">

                {Number(item.price).toLocaleString()}đ

              </p>



            </div>



          ))


        }



      </div>









      {


        result.length > 3 &&


        <button

          className="more-btn"

          onClick={()=>setShowAll(!showAll)}

        >


          {

            showAll

            ?

            "Thu gọn"

            :

            "Xem thêm sản phẩm"


          }



        </button>


      }









      <footer className="footer">


        <div className="contact-icons">


          <a href="tel:0829420098">

            📞

          </a>




          <a

            href="https://zalo.me/0829420098"

            target="_blank"

            rel="noreferrer"

          >

            💬

          </a>




          <a

            href="https://maps.app.goo.gl/ZMPoTMQB5qw9DBg8A"

            target="_blank"

            rel="noreferrer"

          >

            📍

          </a>



        </div>





        <p>

          📍 ĐT615, Chiên Đàn, Đà Nẵng, Việt Nam

        </p>



        <p>

          🕒 07:00 - 21:00

        </p>



      </footer>






        </div>

{showLogin && (
  <div className="admin-login">

    <input
      type="password"
      placeholder="Nhập mật khẩu quản lý"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
    />

    <button onClick={checkAdminPassword}>
      Đăng nhập
    </button>

    <button
      onClick={()=>{
        setShowLogin(false);
        setPassword("");
      }}
    >
      Hủy
    </button>

  </div>
)}
    {showAdmin && (
  <div className="admin-popup">
    <Admin setReload={setReload} />
  </div>
)}
{previewImage && (
  <div
    className="image-preview"
    onClick={() => setPreviewImage("")}
  >

    <button
      className="close-preview"
      onClick={() => setPreviewImage("")}
    >
      ✕
    </button>

    <img
      src={previewImage}
      alt=""
      onClick={(e) => e.stopPropagation()}
    />

  </div>
)}


  </>
  );


}



export default App;