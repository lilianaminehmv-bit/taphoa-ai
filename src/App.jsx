import { useEffect, useState } from "react"
import Papa from "papaparse"
import "./App.css"

function App() {

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Tất cả")


  useEffect(() => {

    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIsI6pV4OWgacgABmvi8Qsbv2gaw0LTQF37-TJcbADqE6Zg7fp7RhRb95Y-gBLt2rjLA_hsNkHD60H/pub?gid=0&single=true&output=csv",
      {
        download: true,
        header: true,
        complete: (result) => {
          setProducts(result.data)
        }
      }
    )

  }, [])


  const categories = [
    "Tất cả",
    "Đồ ăn uống",
    "Đồ gốm sứ",
    "Đồ gia dụng",
    "Đồ điện",
    "Khác"
  ]


  const result = products.filter(item => {

    const matchName =
      item.name?.toLowerCase()
      .includes(search.toLowerCase())

    const matchCategory =
      category === "Tất cả" ||
      item.category === category

    return matchName && matchCategory

  })


  return (

    <div className="store">

      <header className="header">
        <h1>🛒 Tạp Hóa Ngọc Ấn</h1>
        <p>Tìm sản phẩm - Xem giá nhanh</p>
      </header>


      <input
        className="search"
        placeholder="🔍 Tìm sản phẩm..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />


      <div className="categories">

        {categories.map((item,index)=>(

          <button
            key={index}
            onClick={()=>setCategory(item)}
          >
            {item}
          </button>

        ))}

      </div>


      <div className="products">

        {result.map((item,index)=>(

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

        ))}

      </div>

    </div>

  )
}

export default App