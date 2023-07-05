import { useEffect, useState } from 'react';
import Product from '../components/Product/Product';
import RegularInfo from '../components/RegularInfo';
import Count from '../components/Count/Count';
import ProductInfo from '../components/ProductInfo';
import { Link, useParams } from 'react-router-dom';
import './ProductDetail.scss';

const ProductDetail = () => {
  const [carouselDatas, setCarouselData] = useState([]);
  const [product, setProduct] = useState({});
  const [currentTab, setCurrentTab] = useState('First');
  const [imgChange, setImgChange] = useState(false);
  const [number, setNumber] = useState(1);

  const params = useParams();
  const productID = params.id;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/data/MainData.json')
      // fetch('http://10.58.52.154:3000/products/list')
      .then(response => response.json())
      .then(result => setCarouselData(result));
    // .then(result => setCarouselData(result.data));
  }, []);

  useEffect(() => {
    fetch('/data/DetailData.json')
      // fetch(`http://10.58.52.154:3000/products/${4}`)
      .then(response => response.json())
      .then(result => setProduct(result));
    // .then(result => setProduct(result.data));
  }, []);
  // }, [productID]);

  const goToCart = () => {
    fetch('http://10.58.52.154:3000/carts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.productId,
        productOptionId: product.productOptions[0].optionId,
        quantity: number,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Product Added to Cart') {
          alert('상품 추가 성공');
        } else if (data.message === 'TOKEN_NOT_FOUND') {
          alert('토큰값이 request안에 없음');
        } else if (data.message === 'USER_NOT_FOUND') {
          alert('토큰값에 해당하는 유저가 존재하지 않음');
        } else if (data.message === 'INVALID_TOKEN') {
          alert('토큰값이 올바르지 않음');
        } else if (data.message === 'FAILED_TO_UPDATE_CART') {
          alert('상품 추가 실패 시');
        } else if (data.message === 'KEY_ERROR') {
          alert('키에러');
        }
      });
  };

  const goToBuy = () => {
    fetch('http://10.58.52.163:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.productId,
        productOptionId: product.productOptions[0].optionId,
        quantity: number,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'CREATE_ORDER_SUCCESS') {
          <Link to="/purchase" />;
        } else if (data.message === 'KEY_ERROR') {
          alert('구매 실패');
        }
      });
  };

  let totalPrice = 0;
  let price = 0;
  let noItem = false;

  if (product.productPrice) {
    totalPrice = Math.floor(product.productPrice * number).toLocaleString();
    price = Math.floor(product.productPrice).toLocaleString();
    noItem = number > product.productOptions[0].optionInventory;
  }

  return (
    <div className="productDetail">
      <div className="top">
        <div className="title">
          <p className="titleName">{product?.productName}</p>
          <p>{price}원</p>
        </div>
        <div className="fullImage">
          <button
            className="next"
            onClick={() => {
              setImgChange(!imgChange);
            }}
          >
            next
          </button>
          <div className="image">
            <div className="allImage">
              <img
                className="tumbnailImg"
                alt="product1"
                src={product?.productThumbnailImage}
              />
              <img
                className="hoverImg"
                style={{ opacity: imgChange ? 1 : 0 }}
                alt="product2"
                src={product?.productHoverImage}
              />
            </div>
          </div>
          <button
            className="next"
            onClick={() => {
              setImgChange(!imgChange);
            }}
          >
            next
          </button>
        </div>
        <div className="right">
          <div className="border" />
          <div className="delivery">
            <p className="delivaryTitle">배송정보</p>
            <p>3,000원 (30,000원 이상 구매 시 무료)</p>
            <p>오후 1시 당일배송마감</p>
          </div>
          <div className="border" />
          <div className="box">
            <p>{product?.productName}</p>
            <div className="price">
              <div className="countButton">
                <Count number={number} setNumber={setNumber} />
              </div>
              <p>{price}원</p>
            </div>
          </div>
          <div className="totalPrice">
            <p>총 금액</p>
            <p className="total">{totalPrice}원</p>
          </div>
          <div className="getButton">
            <button
              className="cart"
              disabled={noItem}
              style={{ opacity: noItem ? 0.5 : 1 }}
              onClick={() => goToCart()}
            >
              장바구니
            </button>
            <button
              className="get"
              disabled={noItem}
              style={{ opacity: noItem ? 0.5 : 1 }}
              onClick={() => {
                goToBuy();
              }}
            >
              바로 구매하기
            </button>
          </div>
          <p
            className="outOfStock"
            style={{
              opacity: noItem ? '1' : '0',
            }}
          >
            재고가 부족합니다.
          </p>
        </div>
      </div>
      <div className="border" />
      <div className="recommendProducts">
        <h3 className="recommend">이건 어때요?</h3>
        <div className="products">
          {carouselDatas.length > 0 &&
            carouselDatas.slice(0, 4).map(ele => {
              return (
                <Product key={ele.id} data={ele} width={200} height={200} />
              );
            })}
        </div>
      </div>
      <div className="border" />
      <div className="detail">
        <button className="detailBtn" onClick={() => setCurrentTab('First')}>
          상품정보
        </button>
        <p className="gray">|</p>
        <button className="detailBtn" onClick={() => setCurrentTab('Second')}>
          기본정보
        </button>
        <p className="gray">|</p>
        <button className="detailBtn" onClick={() => setCurrentTab('Third')}>
          상품후기
        </button>
      </div>
      <div className="border" />
      <div className="contents">{MAPPING_OBJ[currentTab]}</div>
    </div>
  );
};

export default ProductDetail;

const MAPPING_OBJ = {
  First: <ProductInfo />,
  Second: <RegularInfo />,
  Third: <p className="non">앗!! 후기가 없어요 ㅠㅠ</p>,
};
