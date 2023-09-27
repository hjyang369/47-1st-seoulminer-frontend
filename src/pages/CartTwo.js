import { useEffect, useState } from 'react';
import CartComponent from '../components/CartComponent';
import './CartTwo.scss';
import { Link } from 'react-router-dom';

const CartTwo = () => {
  const [cartDatas, setCartData] = useState([]);
  const [checkBoxes, setCheckBoxes] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [orderPrice, setOrderPrice] = useState([]);
  const token = localStorage.getItem('token');

  // 백엔드용
  // useEffect(() => {
  //   const fetchCartData = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const response = await fetch('http://52.78.25.104:3000/carts/list', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const result = await response.json();
  //       if (Array.isArray(result.data)) {
  //         setCartData(result.data);
  //         setCheckBoxes(Array(result.data.length).fill(false));
  //         setOrderPrice(Array(result.data.length).fill(0));
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchCartData();
  // }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/data/OrderData.json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setCartData(result);
          setCheckBoxes(Array(result.data.length).fill(false));
          setOrderPrice(Array(result.data.length).fill(0));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartData();
  }, []);

  const postUserData = () => {
    fetch('http://52.78.25.104:3000/orders/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        totalPrice: 'totalPrice',
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.message === 'CREATE_ORDER_SUCCESS') {
          <Link to="purchase" />;
        } else if (data.message === 'INVALID_TOKEN') {
          alert('토큰값 이상');
        }
      });
  };

  const deleteAll = () => {
    fetch('http://52.78.25.104:3000/carts/all', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.message === 'TOKEN_NOT_FOUND') {
          alert('토큰 확인 실패 시 (토큰값이 request안에 없음)');
        } else if (data.message === 'USER_NOT_FOUND') {
          alert('토큰 확인 실패 시  (토큰값에 해당하는 유저가 존재하지 않음)');
        } else if (data.message === 'INVALID_TOKEN') {
          alert('토큰값 이상');
        } else if (data.message === 'KEY_ERROR') {
          alert('키에러');
        }
      });
  };

  const deleteItem = () => {
    fetch(`http://52.78.25.104:3000/carts/item/${'cartId'}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.message === 'ITEM_DELETE_SUCCESS') {
          alert('상품 삭제 완료');
        } else if (data.message === 'INVALID_TOKEN') {
          alert('토큰값 이상');
        }
      });
  };

  const patchCart = (cartId, quantity) => {
    fetch('http://52.78.25.104:3000/carts', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: cartId,
        productOptionId: cartId,
        quantity,
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.message === 'CART_UPDATE_SUCCESS') {
          alert('상품 수량변경 성공');
        } else if (data.message === 'TOKEN_NOT_FOUND') {
        } else if (data.message === 'USER_NOT_FOUND') {
        } else if (data.message === 'INVALID_TOKEN') {
        } else if (data.message === 'KEY_ERROR') {
        } else if (data.message === 'PRODUCT_OUT_OF_STOCK') {
        } else if (data.message === 'QUANTITY_EXCEEDS_INVENTORY') {
        } else if (data.message === 'message": "QUANTITY_CANNOT_BE_0') {
        }
      });
  };

  const handleDeleteSelected = () => {
    checkedAll.checked === true ? deleteAll() : deleteItem();
    const selectedProductIds = cartDatas
      .filter((cartData, index) => checkBoxes[index])
      .map(cartData => cartData.productId);

    const updatedCartData = cartDatas.filter(
      cartData => !selectedProductIds.includes(cartData.productId)
    );

    setCartData(updatedCartData);
    setCheckBoxes(Array(updatedCartData.length).fill(false));
  };

  const handleCheckAll = () => {
    const allChecked = checkBoxes.every(checked => checked);
    setCheckedAll(!allChecked);
    setCheckBoxes(Array(cartDatas.length).fill(!allChecked));
  };
  const handleQuantityChange = (Quantity, price, id) => {
    const paymentPrice = Quantity * price;
    const newOrder = [...orderPrice];
    newOrder[id] = paymentPrice;
    setOrderPrice(newOrder);
  };
  // let inintPrice = 0;

  // const inintPricePlus = () => {
  //   for (let i = 0; i < cartDatas.length; i++) {
  //     console.log('.', i);
  //     console.log(cartDatas[i].quantity);
  //     console.log(cartDatas[i].price);
  //     inintPrice += cartDatas[i].quantity * cartDatas[i].price;
  //   }
  //   return inintPrice;
  // };
  // inintPricePlus();

  const totalPrice = orderPrice.reduce((acc, cur) => {
    return acc + cur;
  }, 0);

  // [0, 0, 0, 0]  -> [TotalPrice, 0, 0, 0] -> [추가된 가격, 0, 0, TotalPrice]
  return (
    <div className="cartTwo">
      {cartDatas.length === 0 ? (
        <div className="dataNone">
          <h2 className="title">앗!</h2>
          <div className="text">장바구니가 텅~</div>
        </div>
      ) : (
        <>
          <div className="left">
            <p className="cartTitle">장바구니</p>
            <div className="top">
              <div className="all">
                <input
                  className="checkboxOne"
                  type="checkbox"
                  checked={checkedAll}
                  onChange={handleCheckAll}
                />
                <p className="checkedAll">전체선택</p>
              </div>
              <button
                className="cartTwoDeleteBtn"
                onClick={handleDeleteSelected}
              >
                선택삭제
              </button>
            </div>
            <div className="allBorder">
              <div className="border" />
              <div className="cartMapData">
                {cartDatas?.map((cartData, index) => (
                  <CartComponent
                    key={cartData.cartId}
                    cartData={cartData}
                    checked={checkBoxes[index]}
                    setChecked={isChecked => {
                      const updatedCheckBoxes = [...checkBoxes];
                      updatedCheckBoxes[index] = isChecked;
                      setCheckBoxes(updatedCheckBoxes);
                      setCheckedAll(
                        updatedCheckBoxes.every(checked => checked)
                      );
                    }}
                    onQuantityChange={handleQuantityChange}
                    id={index}
                    patchCart={patchCart}
                    cartId={cartData.cartId}
                  />
                ))}
              </div>

              <div className="border" />
            </div>
          </div>
          <div className="purchaseRightBox">
            <div className="price">
              <p>주문 금액</p>
              <p>{totalPrice?.toLocaleString()}원</p>
            </div>
            <div className="price">
              <p>배송비</p>
              <p>+ 3,000원</p>
            </div>
            <div className="border" />
            <div className="price">
              <p>총 결제금액</p>
              <p>{(totalPrice + 3000)?.toLocaleString()}원</p>
            </div>
            <Link to="/purchase">
              <button className="button" onClick={postUserData}>
                결제하기
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartTwo;
