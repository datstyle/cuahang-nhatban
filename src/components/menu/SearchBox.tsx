import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchTerm = keyword.trim();
    navigate(searchTerm ? `/products?search=${encodeURIComponent(searchTerm)}` : "/products");
  };

  return (
    <form className="topbar-search" data-sound-hover="true" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Đồ cosplay genshin...."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <button type="submit" data-sound-click="true">Tìm kiếm</button>
    </form>
  );
}
