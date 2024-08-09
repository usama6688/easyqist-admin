import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { useAddProductImageMutation, useAddProductMutation, useAddThumbnailMutation, useGetBrandsQuery, useGetProductCatQuery } from "../../services/Api";
import ImageViewer from "../../components/ImageViewer";
import uploadIcon from "../../assets/images/uploadImg.svg";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";

const AddProduct = () => {
  const [showShopImages, setShowShopImages] = useState([]);
  const [showThumbnail, setShowThumbnail] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [advance, setAdvance] = useState("");
  const [description, setDescription] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [special, setSpecial] = useState(0);
  const [trending, setTrending] = useState(0);
  const [discount, setDiscount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [inputFields, setInputFields] = useState([{ title: "" }]);
  const [addThumbnailApi, setAddThumbnailApi] = useState("");
  const [addProductImageApi, setAddProductImageApi] = useState([]);
  const navigator = useNavigate();

  const {
    data: getProductCat,
    isLoading: getProductCatLoading,
    refetch: getProductCatRefetch,
  } = useGetProductCatQuery();

  const {
    data: getBrands,
    isLoading: getBrandLoading,
    refetch: getBrandRefetch,
  } = useGetBrandsQuery({ params: { category_id: "" } });

  const { data: categories } = getProductCat || {};
  const { data: brands } = getBrands || {};

  const [addProduct, { isLoading }] = useAddProductMutation();
  const [addThumbnail, { isLoading: addThumbnailLoading }] = useAddThumbnailMutation();
  const [addProductImage, { isLoading: addProductImageLoading }] = useAddProductImageMutation();

  const addThumbnailHandler = (data) => {

    let formData = new FormData();

    formData.append('thumbnail', data[0]);

    addThumbnail({ data: formData })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          setAddThumbnailApi(payload?.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const updateArray = (data) => {
    setAddProductImageApi(prevArray => [...prevArray, data]);
  };

  const addImageHandler = (data) => {

    let formData = new FormData();

    formData.append('product_image', data);

    addProductImage({ data: formData })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          updateArray(payload?.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleFileChange = (e) => {

    const newImages = [...showShopImages];

    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push((e.target.files[i]));
    }

    setShowShopImages(newImages);
    addImageHandler(e.target.files[0]);
  };

  const addProductHandler = () => {

    const formData = new URLSearchParams();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('detail_description', detailDescription);
    formData.append('special', special);
    formData.append('trending', trending);
    formData.append('category_id', Number(selectedCategoryId));
    formData.append('brand_id', Number(selectedBrandId));
    formData.append('discount', Number(discount));
    formData.append('price', price);
    formData.append('advance', advance);
    formData.append('discount_type', '%');
    formData.append('status', 1);
    formData.append('installment', 1);
    formData.append('thumbnailimage', addThumbnailApi);

    addProductImageApi &&
      addProductImageApi?.forEach((data, index) => {
        formData.append(`productimage[${index}]`, data);
      });

    inputFields.forEach((data, upperIndex) => {
      for (const property in data) {
        if (property === 'title') {
          if (data[property]) {
            formData.append(`product_type[${upperIndex}][${property}]`, data[property]);
          }
        }
        if (property === 'plan') {
          data[property]?.forEach((questionData, innerIndex) => {
            for (const property in questionData) {
              formData.append(
                `product_type[${upperIndex}][installment][${innerIndex}][${property}]`,
                questionData[property]
              );
            }
          });
        }
      }
    });

    addProduct({ data: formData })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          console.log("success");
          navigator(PATHS.products);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleThumbnail = (e) => {
    const maxImages = 1;

    const imagesMap = Object.entries(e.target.files).map((images) => {
      return (images[1])
    });

    const previousImages = [...showThumbnail];

    const combinedImages = [...previousImages, ...imagesMap];

    if (combinedImages.length > maxImages) {
      alert("Please select up to 1 images only.");
      return;
    }

    setShowThumbnail(combinedImages);

    addThumbnailHandler(combinedImages);
  };

  const removeShopImages = (image) => {
    let filteredData = [];
    if (image.id) {
      filteredData = showShopImages.filter((i) =>
        i.hasOwnProperty("id") ? i.id !== image.id : true
      );
    } else {
      filteredData = showShopImages.filter((i) => i.name !== image.name);
    }
    setShowShopImages([...filteredData]);
  };

  const removeThumbnail = (image) => {
    let filteredData = [];
    if (image.id) {
      filteredData = showThumbnail.filter((i) =>
        i.hasOwnProperty("id") ? i.id !== image.id : true
      );
    } else {
      filteredData = showThumbnail.filter((i) => i.name !== image.name);
    }
    setShowThumbnail([...filteredData]);
  };

  const handleSpecial = (e) => {
    const value = e.target.value;

    if (/^[01]?$/.test(value)) {
      setSpecial(value);
    }
  };

  const handleTrending = (e) => {
    const value = e.target.value;

    if (/^[01]?$/.test(value)) {
      setTrending(value);
    }
  };

  const handleCatChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCategoryId(selectedId);
  };

  const handleBrandChange = (e) => {
    const selectedId = e.target.value;
    setSelectedBrandId(selectedId);
  };

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        title: "",
      },
    ]);
  };

  const addInnerInputFields = (index) => {
    let rows = [...inputFields];
    if (rows[index].plan?.length) {
      rows[index].plan = [...rows[index].plan, { installment_title: "", duration: "", amount: "", advance: "", total_amount: "" }];
    } else {
      rows[index].plan = [{ installment_title: "", duration: "", amount: "", advance: "", total_amount: "" }];
    }
    setInputFields([...rows]);
  };

  const removeInputFieldsOnAdd = (index) => {
    let rows = [...inputFields];
    rows = rows.filter((data, dataIndex) => dataIndex !== index);
    setInputFields([...rows]);
  };

  const removeInnerInputFields = (upperIndex, innerIndex) => {
    let rows = [...inputFields];
    let mutatingArray = rows[upperIndex].plan;
    mutatingArray = mutatingArray.filter(
      (data, dataIndex) => dataIndex !== innerIndex
    );
    rows[upperIndex].plan = mutatingArray;
    setInputFields([...rows]);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };

  const planNameChange = (upperIndex, innerIndex, value) => {
    const list = [...inputFields];
    let installment_title = list[upperIndex].plan;
    installment_title[innerIndex].installment_title = value;
    list[upperIndex].plan = installment_title;
    setInputFields(list);
  };

  const monthsNameChange = (upperIndex, innerIndex, value) => {
    const list = [...inputFields];
    let duration = list[upperIndex].plan;
    duration[innerIndex].duration = value;
    list[upperIndex].plan = duration;
    setInputFields(list);
  };

  const priceNameChange = (upperIndex, innerIndex, value) => {
    const list = [...inputFields];
    let amount = list[upperIndex].plan;
    amount[innerIndex].amount = value;
    list[upperIndex].plan = amount;
    setInputFields(list);
  };

  const advanceNameChange = (upperIndex, innerIndex, value) => {
    const list = [...inputFields];
    let advance = list[upperIndex].plan;
    advance[innerIndex].advance = value;
    list[upperIndex].plan = advance;
    setInputFields(list);
  };

  const amountNameChange = (upperIndex, innerIndex, value) => {
    const list = [...inputFields];
    let total_amount = list[upperIndex].plan;
    total_amount[innerIndex].total_amount = value;
    list[upperIndex].plan = total_amount;
    setInputFields(list);
  };

  return (
    <div>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Product Name</Label>
          <Input name="name" placeholder="Name" type="text" onChange={(e) => setName(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail">Price</Label>
          <Input placeholder="Price" type="number" onChange={(e) => setPrice(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail">Advance</Label>
          <Input placeholder="Advance" type="number" onChange={(e) => setAdvance(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Description</Label>
          <Input id="exampleText" name="description" rows="8" type="textarea" placeholder="Type..." onChange={(e) => setDescription(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Detail Description</Label>
          <Input id="exampleText" type="textarea" rows="8" placeholder="Type..." onChange={(e) => setDetailDescription(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Special</Label>
          <Input
            id="exampleText"
            name="description"
            type="number"
            value={special}
            onChange={handleSpecial}
            pattern="[01]"
          />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Trending</Label>
          <Input
            id="exampleText"
            name="description"
            type="number"
            value={trending}
            onChange={handleTrending}
            pattern="[01]"
          />
        </FormGroup>

        <FormGroup>
          <Label for="exampleSelect">Select Category</Label>
          <Input id="exampleSelect" name="select" type="select" onChange={handleCatChange} value={selectedCategoryId}>
            <option value="">Select category</option>
            {categories?.map((item, index) => {
              return <option key={index} value={item?.id}>{item?.name}</option>;
            })}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="exampleSelect">Select Brand</Label>
          <Input id="exampleSelect" name="select" type="select" onChange={handleBrandChange} value={selectedBrandId}>
            <option value="">Select Brand</option>
            {brands?.map((item, index) => {
              return <option key={index} value={item?.id}>{item?.brand_name}</option>;
            })}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail">Discount</Label>
          <Input name="name" placeholder="Type.." type="number" onChange={(e) => setDiscount(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label for="exampleFile">Thumbnail</Label>

          <div className='position-relative ms-5 mb-4'>
            <div className="row">

              {showThumbnail?.length < 6 ?
                <div className="col-md-3">
                  <img src={uploadIcon} alt="" height={100} width={100} />
                  <input type="file" className='hiddenInputFile' name="image"
                    accept="image/png, image/jpg, image/jpeg" onChange={handleThumbnail} />
                </div>
                : ""}

              {showThumbnail?.length > 0 &&
                showThumbnail?.map((image) => (
                  <div className="col-md-3 mt-3 position-relative">
                    <ImageViewer
                      src={image}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                      }}
                      width="100px"
                      height="100px"
                    />

                    <div
                      className='removeImageIcon text-dark'
                      onClick={() => removeThumbnail(image)}
                    >X</div>
                  </div>
                ))}
            </div>
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="exampleFile">Image(s)</Label>

          <div className='position-relative ms-5 mb-4'>
            <div className="row">

              {showShopImages?.length < 6 ?
                <div className="col-md-3">
                  <img src={uploadIcon} alt="" height={100} width={100} />
                  <input type="file" className='hiddenInputFile' name="image"
                    accept="image/png, image/jpg, image/jpeg" onChange={handleFileChange} />
                </div>
                : ""}

              {showShopImages?.length > 0 &&
                showShopImages?.map((image) => (
                  <div className="col-md-3 mt-3 position-relative">
                    <ImageViewer
                      src={image}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                      }}
                      width="100px"
                      height="100px"
                    />

                    <div
                      className='removeImageIcon text-dark'
                      onClick={() => removeShopImages(image)}
                    >X</div>
                  </div>
                ))}
            </div>
          </div>
        </FormGroup>

        <Label for="exampleText" style={{ marginBottom: 15 }}>
          Add Types
        </Label>

        <div className="row mt-3 title-row m-0">
          {inputFields.map((data, upperIndex) => {
            const { name } = data;
            return (
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-12 p-0 mb-4">
                    <div>
                      <div className="d-flex align-item-center justify-content-between">
                        <label className="topic_label fs-12">Type {upperIndex + 1}</label>
                        <h4 onClick={() => { removeInputFieldsOnAdd(upperIndex) }}>X</h4>
                      </div>

                      <div>
                        <input
                          type="text"
                          className="form-control fontSize"
                          placeholder="Type here..."
                          value={name}
                          onChange={(evnt) => handleChange(upperIndex, evnt)}
                          name="title"
                          maxLength="150"
                        />
                      </div>

                      {data.plan?.length
                        ? data.plan.map((questiondata, innerIndex) => {

                          return (
                            <>
                              <div
                                className="d-flex mt-2"
                                style={{ gap: "10px" }}
                              >
                                <div className="w-100">

                                  <div className="topic_label fs-12 mt-3">
                                    Plan {innerIndex + 1}
                                  </div>

                                  <input
                                    type="text"
                                    placeholder="Plan name"
                                    className="form-control mb-2"
                                    value={questiondata.installment_title}
                                    onChange={(e) =>
                                      planNameChange(
                                        upperIndex,
                                        innerIndex,
                                        e.target.value
                                      )
                                    }
                                  />

                                  <input
                                    type="number"
                                    placeholder="Months"
                                    className="form-control mb-2"
                                    value={questiondata.duration}
                                    onChange={(e) =>
                                      monthsNameChange(
                                        upperIndex,
                                        innerIndex,
                                        e.target.value
                                      )
                                    }
                                  />

                                  <input
                                    type="number"
                                    placeholder="Price"
                                    className="form-control mb-2"
                                    value={questiondata.amount}
                                    onChange={(e) =>
                                      priceNameChange(
                                        upperIndex,
                                        innerIndex,
                                        e.target.value
                                      )
                                    }
                                  />

                                  <input
                                    type="number"
                                    placeholder="Advance"
                                    className="form-control mb-2"
                                    value={questiondata.advance}
                                    onChange={(e) =>
                                      advanceNameChange(
                                        upperIndex,
                                        innerIndex,
                                        e.target.value
                                      )
                                    }
                                  />

                                  <input
                                    type="number"
                                    placeholder="Total amount"
                                    className="form-control mb-2"
                                    value={questiondata.total_amount}
                                    onChange={(e) =>
                                      amountNameChange(
                                        upperIndex,
                                        innerIndex,
                                        e.target.value
                                      )
                                    }
                                  />

                                  {/* <div className="text-end">
                                    <Button className="mt-2 bg-danger" onClick={() =>
                                      removeInnerInputFields(
                                        upperIndex,
                                        innerIndex
                                      )
                                    }>Remove</Button>
                                  </div> */}
                                </div>
                              </div>
                            </>
                          )
                        })
                        : null}
                      <div>
                        <Button className="mt-2 w-100 bg-primary" onClick={() => addInnerInputFields(upperIndex)}>Add Plan +</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="col-lg-12 mt-4 p-0">
            <Button className="mt-2 w-100 bg-primary" onClick={addInputField}>Add Type +</Button>
          </div>
        </div>

        <Button className="mt-5" onClick={addProductHandler}>Submit</Button>
      </Form>
    </div>
  );
};

export default AddProduct;
