import { useEffect, useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIsI6pV4OWgacgABmvi8Qsbv2gaw0LTQF37-TJcbADqE6Zg7fp7RhRb95Y-gBLt2rjLA_hsNkHD60H/pub?gid=0&single=true&output=csv",
      {
        download: true,
        header: true,
        complete: (result) => {
          setProducts(result.data);
        },
      }
    );
  }, []);

  const categories = [
    "Tất cả",
    "Đồ ăn uống",
    "Đồ gốm sứ",
    "Đồ gia dụng",
    "Đồ điện",
    "Khác",
  ];

  const result = products.filter((item) => {
    const matchName = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "Tất cả" || item.category === category;

    return matchName && matchCategory;
  });

  return (
    <div className="store">

      <header className="header">
        <h1>🛒 Tạp Hóa Ngọc Ấn</h1>

        <p className="subtitle">
          Giá có thể thay đổi theo thời điểm
        </p>

        <div className="store-info">
          <p>📍 ĐT615, Chiên Đàn, Đà Nẵng, Việt Nam</p>
          <p>🕒 07:00 - 21:00</p>
        </div>

        <div className="quick-actions">
          <a
            href="tel:0829420098"
            className="action-btn"
          >
            📞 Gọi ngay
          </a>

          <a
            href="https://zalo.me/0829420098"
            target="_blank"
            rel="noreferrer"
            className="action-btn"
          >
            💬 Zalo
          </a>

          <a
            href="https://maps.app.goo.gl/ZMPoTMQB5qw9DBg8A"
            target="_blank"
            rel="noreferrer"
            className="action-btn"
          >
            📍 Chỉ đường
          </a>
        </div>

      </header>

      <input
        className="search"
        placeholder="🔍 Tìm tên sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
          color: "#555",
        }}
      >
        Đang hiển thị: <span style={{ color: "#16a34a" }}>{result.length}</span> sản phẩm
      </p>

      <div className="categories">
        {categories.map((item, index) => (
          <button
            key={index}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="products">
        {result.map((item, index) => (
          <div className="card" key={index}>
            <img
              src={item.image}
              alt={item.name}
            />

            <h3>{item.name}</h3>

            <p>{item.category}</p>

            <p className="price">
              {Number(item.price).toLocaleString()}đ
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;