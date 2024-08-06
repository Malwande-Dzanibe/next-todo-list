"use client";

import { FormEvent, useState, useEffect } from "react";

const Index = () => {
  const getItems = () => {
    let result;

    if (typeof window !== "undefined") {
      result = localStorage.getItem("items");
    } else if (result == null || result == undefined) {
      return [];
    }

    return result ? JSON.parse(result) : [];
  };

  const [value, setValue] = useState("");
  const [items, setItems] = useState<{ title: string; id: string }[]>(
    getItems()
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value && !isEditing) {
      setItems((prev) => {
        return [...prev, { id: new Date().getTime().toString(), title: value }];
      });

      setValue("");
      setEditId(null);
      setIsEditing(false);
    } else if (isEditing && value) {
      setItems(
        items.map((item) => {
          if (item.id === editId) {
            return {
              ...item,
              title: value,
            };
          }

          return item;
        })
      );

      setValue("");
      setEditId(null);
      setIsEditing(false);
    }
  };

  const handleDelete = (itemm: { title: string; id: string }) => {
    setItems((prev) => {
      return prev.filter((item) => {
        return item.id !== itemm.id;
      });
    });

    setValue("");
    setEditId(null);
    setIsEditing(false);
  };

  const handleEdit = (itemm: { title: string; id: string }) => {
    setIsEditing(true);
    setEditId(itemm.id);
    setValue(itemm.title);
  };

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    setIsClient(true);
  }, [isClient]);

  return (
    isClient && (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            className="item-input"
            value={value}
            type="text"
            placeholder="item"
            required
            onChange={(event) => setValue(event.target.value)}
          />
          <button className="add">ADD</button>
        </form>
        <div className="items-wrapper">
          {items.map((item) => {
            return (
              <div className="item" key={item.id}>
                <h4>{item.title}</h4>
                <div className="buttons-wrapper">
                  <button className="edit" onClick={() => handleEdit(item)}>
                    edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(item)}>
                    delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};
export default Index;
