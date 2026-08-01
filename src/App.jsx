import { useEffect, useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {

    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIsI6pV4OWgacgABmvi8Qsbv2gaw0LTQF37-TJcbADqE6Zg7fp7RhRb95Y-gBLt2rjLA_hsNkHD60H/pub?gid=0&single=true&output=csv",
      {
        download: true,
        header: true,
        complete: (result) => {
          setProducts(result.data);
        }
      }
    );

  }, []);


  const categories = [
    "Tất cả",
    "Đồ ăn uống",
    "Đồ gốm sứ",
    "Đồ gia dụng",
    "Đồ điện",
    "Khác"
  ];


  const result = products.filter(item => {

    const matchName =
      item.name?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "Tất cả" ||
      item.category === category;

    return matchName && matchCategory;

  });


  // Nếu đang tìm kiếm hoặc chọn danh mục thì hiện hết
  const isSearching =
    search !== "" || category !== "Tất cả";


  const displayProducts =
    isSearching || showAll
    ? result
    : result.slice(0,2);



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
        onChange={(e)=>{
          setSearch(e.target.value);
          setShowAll(false);
        }}
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
        Tìm thấy {result.length} sản phẩm
      </p>



      <div className="products">

        {
          displayProducts.map((item,index)=>(

            <div className="card" key={index}>

              <img
                src={item.image}
                alt={item.name}
              />

              <h3>
                {item.name}
              </h3>

              <p>
                {item.category}
              </p>

              <p className="price">
                {Number(item.price).toLocaleString()}đ
              </p>

            </div>

          ))
        }

      </div>



      {
        !isSearching &&
        result.length > 2 &&

        <button
          className="more-btn"
          onClick={()=>setShowAll(!showAll)}
        >
          {
            showAll
            ? "Thu gọn"
            : "Xem thêm sản phẩm"
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