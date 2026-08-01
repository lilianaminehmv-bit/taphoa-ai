import { useEffect, useState } from "react";
import Papa from "papaparse";
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


  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("Tất cả");

  const [showAll, setShowAll] = useState(false);





  useEffect(() => {


    const sheetURL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIsI6pV4OWgacgABmvi8Qsbv2gaw0LTQF37-TJcbADqE6Zg7fp7RhRb95Y-gBLt2rjLA_hsNkHD60H/pub?gid=0&single=true&output=csv";



    Papa.parse(sheetURL, {


      download:true,

      header:true,



      complete:(result)=>{


        console.log(result.data);



        const data = result.data.filter(item =>

          item.name && item.price

        );



        setProducts(data);


      },


      error:(error)=>{


        console.log("Lỗi tải dữ liệu:",error);


      }


    });



  },[]);








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









  return (


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



            <div className="card" key={index}>


              {


                item.image &&


                <img

                  src={item.image}

                  alt={item.name}

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


  );


}



export default App;