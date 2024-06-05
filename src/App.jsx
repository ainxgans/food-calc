import React, { useState, useEffect } from "react";

const App = () => {
  const [items, setItems] = useState([{ price: "", qty: "1" }]);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");

  const handleDiscountChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setTotalAfterDiscount(value);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value.replace(/[^0-9]/g, "");
    setItems(newItems);
  };

  useEffect(() => {
    const lastItem = items[items.length - 1];
    if (lastItem.price !== "" && lastItem.qty !== "") {
      setItems([...items, { price: "", qty: "1" }]);
    }
  }, [items]);

  const calculateTotalBeforeDiscount = () => {
    return items.reduce(
      (acc, item) =>
        acc +
        (parseInt(item.price.replace(/\./g, ""), 10) || 0) *
          (parseInt(item.qty, 10) || 0),
      0
    );
  };

  const calculateDiscountedPrices = () => {
    const totalBeforeDiscount = calculateTotalBeforeDiscount();
    const discountFactor = totalBeforeDiscount
      ? parseInt(totalAfterDiscount.replace(/\./g, ""), 10) /
        totalBeforeDiscount
      : 0;

    return items.map((item) => ({
      ...item,
      discountedPrice: Math.round(
        (parseInt(item.price.replace(/\./g, ""), 10) || 0) * discountFactor
      ),
    }));
  };

  const formatToIDR = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(number)
      .replace(/[Rp\s]/g, "")
      .trim();
  };

  const handleFormattedInputChange = (e, index) => {
    const { name, value } = e.target;
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const newItems = [...items];
    newItems[index][name] = formattedValue;
    setItems(newItems);
  };

  const discountedItems = calculateDiscountedPrices();

  return (
    <div className="min-h-screen text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <table className="table-auto w-full mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Harga</th>
              <th className="px-4 py-2 text-left">Kuantitas</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Harga Setelah Diskon</th>
            </tr>
          </thead>
          <tbody>
            {discountedItems.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleFormattedInputChange(e, index)}
                    className="w-full px-2 py-1 border rounded bg-gray-700 text-white"
                    onKeyDown={(e) =>
                      (e.key === "e" || e.key === "-") && e.preventDefault()
                    }
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full px-2 py-1 border rounded bg-gray-700 text-white"
                    onKeyDown={(e) =>
                      (e.key === "e" || e.key === "-") && e.preventDefault()
                    }
                  />
                </td>
                <td className="border px-4 py-2">
                  {item.price && item.qty
                    ? formatToIDR(
                        parseInt(item.price.replace(/\./g, ""), 10) *
                          parseInt(item.qty, 10)
                      )
                    : formatToIDR(0)}
                </td>
                <td className="border px-4 py-2">
                  {item.discountedPrice && item.qty
                    ? formatToIDR(item.discountedPrice)
                    : formatToIDR(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-xl font-semibold mb-2">
          Total Sebelum Diskon: {formatToIDR(calculateTotalBeforeDiscount())}
        </h2>
        <label className="block mb-4">
          Total Setelah Diskon:
          <input
            type="text"
            value={totalAfterDiscount}
            onChange={handleDiscountChange}
            className="w-full px-2 py-1 border rounded mt-1 bg-gray-700 text-white"
            onKeyDown={(e) =>
              (e.key === "e" || e.key === "-") && e.preventPrevent()
            }
          />
        </label>
      </div>
    </div>
  );
};

export default App;
