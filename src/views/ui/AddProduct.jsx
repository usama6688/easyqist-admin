import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import {
  useAddProductImageMutation,
  useAddProductMutation,
  useAddThumbnailMutation,
  useGetBrandsQuery,
  useGetProductCatQuery
} from "../../services/Api";
import ImageViewer from "../../components/ImageViewer";
import uploadIcon from "../../assets/images/uploadImg.svg";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [advance, setAdvance] = useState("");
  const [description, setDescription] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [special, setSpecial] = useState(0);
  const [trending, setTrending] = useState(0);
  const [discount, setDiscount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productImagesPreviews, setProductImagesPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const durationOptions = [3, 6, 9, 11];

  // Get duration options based on selected category
  const getDurationOptions = () => {
    const categoryName = getCategoryName(selectedCategoryId);
    const categoryLower = categoryName ? categoryName.toLowerCase() : "";
    const isBike =
      categoryLower.includes("bike") ||
      categoryLower.includes("motorcycle") ||
      categoryLower.includes("motorbike");

    if (isBike) {
      return [3, 6, 9, 11, 12];
    }
    return [3, 6, 9, 11]; 
  };

  const [plans, setPlans] = useState([
    {
      title: "",
      subPlans: [
        {
          installment_title: "",
          down_payment_percentage: "",
          duration: "",
          advance: "",
          amount: "",
          total_amount: ""
        }
      ]
    }
  ]);

  const navigate = useNavigate();
  const { data: categories } = useGetProductCatQuery();
  const { data: brands } = useGetBrandsQuery({
    params: { category_id: selectedCategoryId || "" }
  });
  const [addProduct] = useAddProductMutation();
  const [addThumbnail] = useAddThumbnailMutation();
  const [addProductImage] = useAddProductImageMutation();

  const calculateInstallmentPlan = (
    basePrice,
    duration,
    downPaymentPercentage,
    categoryName,
    brandName
  ) => {
    console.log("--- CALCULATION INPUTS ---");
    console.log("Base Price:", basePrice);
    console.log("Duration:", duration);
    console.log("Down Payment %:", downPaymentPercentage);
    console.log("Category:", categoryName);
    console.log("Brand:", brandName);

    if (
      !basePrice ||
      !duration ||
      downPaymentPercentage === "" ||
      downPaymentPercentage === null
    ) {
      console.log("Missing required inputs for calculation");
      return { advance: "", amount: "", total_amount: "" };
    }

    const price = parseFloat(basePrice);
    const months = parseInt(duration);
    const downPercent = parseFloat(downPaymentPercentage);

    // Validate parsed values
    if (isNaN(price) || isNaN(months) || isNaN(downPercent)) {
      console.log("Invalid numeric values");
      return { advance: "", amount: "", total_amount: "" };
    }

    let markupPercent = 0;
    const categoryLower = categoryName ? categoryName.toLowerCase() : "";
    const isMobile =
      categoryLower.includes("mobile") ||
      categoryLower.includes("phone") ||
      categoryLower.includes("smartphone");
    const isBike =
      categoryLower.includes("bike") ||
      categoryLower.includes("motorcycle") ||
      categoryLower.includes("motorbike");

    console.log("Category Detection:", { categoryLower, isMobile, isBike });

    if (months === 3) {
      markupPercent = isMobile ? 35 : 31;
    } else if (months === 6) {
      markupPercent = isMobile ? 40 : 36;
    } else if (months === 9) {
      markupPercent = isMobile ? 45 : 41;
    } else if (months === 11) {
      markupPercent = isMobile ? 50 : 46;
    } else if (months === 12) {
      markupPercent = isBike ? 60 : isMobile ? 55 : 50; 
    }

    if (isBike && (downPercent === 30 || downPercent === 50)) {
      markupPercent = 55;
    }

    console.log("Markup Percent:", markupPercent);

    const advanceAmount = price * (downPercent / 100);
    const remainingAmount = price - advanceAmount;
    const markupOnRemaining = remainingAmount * (markupPercent / 100);
    const totalRemainingWithMarkup = remainingAmount + markupOnRemaining;
    const monthlyInstallment = totalRemainingWithMarkup / months;
    const totalAmount = advanceAmount + totalRemainingWithMarkup;

    console.log("--- CALCULATION RESULTS ---");
    console.log("Advance:", Math.round(advanceAmount).toString());
    console.log(
      "Monthly Installment:",
      Math.round(monthlyInstallment).toString()
    );
    console.log("Total Amount:", Math.round(totalAmount).toString());

    return {
      advance: Math.round(advanceAmount).toString(),
      amount: Math.round(monthlyInstallment).toString(),
      total_amount: Math.round(totalAmount).toString()
    };
  };

  const getCategoryName = (categoryId) => {
    if (!categories?.data || !categoryId) return "";
    const category = categories.data.find(
      (cat) => cat.id.toString() === categoryId.toString()
    );
    return category ? category.name : "";
  };

  const getBrandName = (brandId) => {
    if (!brands?.data || !brandId) return "";
    const brand = brands.data.find(
      (b) => b.id.toString() === brandId.toString()
    );
    return brand ? brand.brand_name : "";
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...files]);
    setProductImagesPreviews((prev) => [...prev, ...newPreviews]);
  };

  const uploadThumbnail = async () => {
    if (!thumbnail) return "";
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    try {
      const response = await addThumbnail({ data: formData }).unwrap();
      if (response.status) return response.data;
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
    }
    return "";
  };

  const uploadProductImages = async () => {
    if (productImages.length === 0) return [];
    const uploadPromises = productImages.map(async (image) => {
      const formData = new FormData();
      formData.append("product_image", image);
      try {
        const response = await addProductImage({ data: formData }).unwrap();
        return response.status ? response.data : null;
      } catch (error) {
        console.error("Image upload failed:", error);
        return null;
      }
    });
    const results = await Promise.all(uploadPromises);
    return results.filter((path) => path !== null);
  };

  const addPlan = () => {
    setPlans([
      ...plans,
      {
        title: "",
        subPlans: [
          {
            installment_title: "",
            down_payment_percentage: "",
            duration: "",
            advance: "",
            amount: "",
            total_amount: ""
          }
        ]
      }
    ]);
  };

  const removePlan = (index) => {
    const newPlans = [...plans];
    newPlans.splice(index, 1);
    setPlans(newPlans);
  };

  const addSubPlan = (planIndex) => {
    const newPlans = [...plans];
    newPlans[planIndex].subPlans.push({
      installment_title: "",
      down_payment_percentage: "",
      duration: "",
      advance: "",
      amount: "",
      total_amount: ""
    });
    setPlans(newPlans);
  };

  const removeSubPlan = (planIndex, subPlanIndex) => {
    const newPlans = [...plans];
    newPlans[planIndex].subPlans.splice(subPlanIndex, 1);
    setPlans(newPlans);
  };

  const handlePlanChange = (planIndex, field, value) => {
    const newPlans = [...plans];
    newPlans[planIndex][field] = value;
    setPlans(newPlans);
  };

  const handleSubPlanChange = (planIndex, subPlanIndex, field, value) => {
    const newPlans = [...plans];
    newPlans[planIndex].subPlans[subPlanIndex][field] = value;

    if (field === "duration" || field === "down_payment_percentage") {
      const categoryName = getCategoryName(selectedCategoryId);
      const brandName = getBrandName(selectedBrandId);

      console.log("Recalculating for:", {
        categoryName,
        brandName,
        selectedCategoryId
      });

      const calculations = calculateInstallmentPlan(
        price,
        newPlans[planIndex].subPlans[subPlanIndex].duration,
        newPlans[planIndex].subPlans[subPlanIndex].down_payment_percentage,
        categoryName,
        brandName
      );

      newPlans[planIndex].subPlans[subPlanIndex].advance = calculations.advance;
      newPlans[planIndex].subPlans[subPlanIndex].amount = calculations.amount;
      newPlans[planIndex].subPlans[subPlanIndex].total_amount =
        calculations.total_amount;
    }

    setPlans(newPlans);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);

    setSelectedBrandId("");

    if (price && categoryId) {
      const categoryName = getCategoryName(categoryId);
      const brandName = getBrandName(selectedBrandId);

      console.log("Category changed, recalculating:", {
        categoryName,
        categoryId
      });

      const updatedPlans = plans.map((plan) => ({
        ...plan,
        subPlans: plan.subPlans.map((subPlan) => {
          if (subPlan.duration && subPlan.down_payment_percentage !== "") {
            const calculations = calculateInstallmentPlan(
              price,
              subPlan.duration,
              subPlan.down_payment_percentage,
              categoryName,
              brandName
            );
            return {
              ...subPlan,
              advance: calculations.advance,
              amount: calculations.amount,
              total_amount: calculations.total_amount
            };
          }
          return subPlan;
        })
      }));
      setPlans(updatedPlans);
    }
  };

  // Handle brand selection change
  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrandId(brandId);
    if (price && selectedCategoryId) {
      const categoryName = getCategoryName(selectedCategoryId);
      const brandName = getBrandName(brandId);

      console.log("Brand changed, recalculating:", { brandName, brandId });

      const updatedPlans = plans.map((plan) => ({
        ...plan,
        subPlans: plan.subPlans.map((subPlan) => {
          if (subPlan.duration && subPlan.down_payment_percentage !== "") {
            const calculations = calculateInstallmentPlan(
              price,
              subPlan.duration,
              subPlan.down_payment_percentage,
              categoryName,
              brandName
            );
            return {
              ...subPlan,
              advance: calculations.advance,
              amount: calculations.amount,
              total_amount: calculations.total_amount
            };
          }
          return subPlan;
        })
      }));
      setPlans(updatedPlans);
    }
  };

  useEffect(() => {
    if (price && selectedCategoryId) {
      const categoryName = getCategoryName(selectedCategoryId);
      const brandName = getBrandName(selectedBrandId);

      console.log("Price changed, recalculating:", {
        categoryName,
        brandName,
        price
      });

      const updatedPlans = plans.map((plan) => ({
        ...plan,
        subPlans: plan.subPlans.map((subPlan) => {
          if (subPlan.duration && subPlan.down_payment_percentage !== "") {
            const calculations = calculateInstallmentPlan(
              price,
              subPlan.duration,
              subPlan.down_payment_percentage,
              categoryName,
              brandName
            );
            return {
              ...subPlan,
              advance: calculations.advance,
              amount: calculations.amount,
              total_amount: calculations.total_amount
            };
          }
          return subPlan;
        })
      }));
      setPlans(updatedPlans);
    }
  }, [price]); 

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      if (!name || !price || !selectedCategoryId || !selectedBrandId) {
        alert(
          "Please fill in all required fields (Name, Price, Category, Brand)"
        );
        setIsUploading(false);
        return;
      }

      // Upload images
      const [thumbnailPath, imagePaths] = await Promise.all([
        uploadThumbnail(),
        uploadProductImages()
      ]);

      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("advance", advance || "0");
      formData.append("description", description);
      formData.append("detail_description", detailDescription);
      formData.append("special", special);
      formData.append("trending", trending);
      formData.append("discount", discount || "0");
      formData.append("category_id", selectedCategoryId);
      formData.append("brand_id", selectedBrandId);
      formData.append("thumbnailimage", thumbnailPath);
      formData.append("discount_type", "%");
      formData.append("status", 1);
      formData.append(
        "installment",
        plans.some((plan) => plan.title && plan.subPlans.length > 0) ? 1 : 0
      );

      // Add product images
      imagePaths.forEach((path, index) => {
        formData.append(`productimage[${index}]`, path);
      });

      plans.forEach((plan, planIndex) => {
        if (plan.title) {
          formData.append(`product_type[${planIndex}][title]`, plan.title);
          plan.subPlans.forEach((subPlan, subPlanIndex) => {
            formData.append(
              `product_type[${planIndex}][payment_options][${subPlanIndex}][installment_title]`,
              subPlan.installment_title || ""
            );
            formData.append(
              `product_type[${planIndex}][payment_options][${subPlanIndex}][down_payment_percentage]`,
              subPlan.down_payment_percentage || ""
            );
            formData.append(
              `product_type[${planIndex}][payment_options][${subPlanIndex}][duration]`,
              subPlan.duration || ""
            );
            formData.append(
              `product_type[${planIndex}][payment_options][${subPlanIndex}][advance]`,
              subPlan.advance || "0"
            );
            formData.append(
              `product_type[${planIndex}][payment_options][${subPlanIndex}][amount]`,
              subPlan.amount || "0"
            );
            formData.append(
              `product_type[${planIndex}][payment_options][${subPlanIndex}][total_amount]`,
              subPlan.total_amount || "0"
            );
          });
        }
      });

      const response = await addProduct({ data: formData }).unwrap();
      if (response.status) {
        navigate(PATHS.products);
      }
    } catch (error) {
      console.error("Product submission failed:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      productImagesPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [thumbnailPreview, productImagesPreviews]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Add New Product</h2>

      <Form onSubmit={handleSubmit}>
        {/* Basic Product Information */}
        <div className="card mb-4">
          <div className="card-header">Product Information</div>
          <div className="card-body">
            <FormGroup>
              <Label>Product Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>

            <div className="row">
              <div className="col-md-4">
                <FormGroup>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label>Advance Payment</Label>
                  <Input
                    type="number"
                    value={advance}
                    onChange={(e) => setAdvance(e.target.value)}
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </FormGroup>
              </div>
            </div>

            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Detailed Description</Label>
              <Input
                type="textarea"
                rows="5"
                value={detailDescription}
                onChange={(e) => setDetailDescription(e.target.value)}
              />
            </FormGroup>

            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label>Category</Label>
                  <Input
                    type="select"
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories?.data?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label>Brand</Label>
                  <Input
                    type="select"
                    value={selectedBrandId}
                    onChange={handleBrandChange}
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands?.data?.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.brand_name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label>Special</Label>
                  <Input
                    type="number"
                    value={special}
                    onChange={handleSpecial}
                    pattern="[01]"
                  />
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label>Trending</Label>
                  <Input
                    type="number"
                    value={trending}
                    onChange={handleTrending}
                    pattern="[01]"
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="card mb-4">
          <div className="card-header">Product Images</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <Label>Thumbnail Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                  {thumbnailPreview && (
                    <div className="mt-2">
                      <ImageViewer
                        src={thumbnailPreview}
                        width="150"
                        height="150"
                      />
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label>Additional Images</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductImagesChange}
                  />
                  <div className="d-flex flex-wrap mt-2">
                    {productImagesPreviews.map((preview, index) => (
                      <div key={index} className="me-2 mb-2 position-relative">
                        <ImageViewer src={preview} width="100" height="100" />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => {
                            setProductImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            setProductImagesPreviews((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </FormGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Product Types and Installments */}
        <div className="card mb-4">
          {/* <div className="card-header">
            Product Types and Installment Plans
            <small className="text-muted d-block mt-1">
              Auto-calculation: Markup applied on remaining amount only | 3
              months (Mobile: 35%, Others: 31%) | 6 months (Mobile: 40%, Others:
              36%) | 9 months (Mobile: 45%, Others: 41%) | 11 months (Mobile:
              50%, Others: 46%) | 12 months (Bikes: 60%, Mobile: 55%, Others:
              50%) | Bikes: 55% for 30% or 50% down payment
            </small>
          </div> */}
          <div className="card-body">
            {plans.map((plan, planIndex) => (
              <div key={planIndex} className="mb-4 border p-3 rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Type {planIndex + 1}</h5>
                  {plans.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removePlan(planIndex)}
                    >
                      Remove Type
                    </button>
                  )}
                </div>

                <FormGroup>
                  <Label>Type Name</Label>
                  <Input
                    type="text"
                    value={plan.title}
                    onChange={(e) =>
                      handlePlanChange(planIndex, "title", e.target.value)
                    }
                    placeholder="e.g., Basic, Premium"
                  />
                </FormGroup>

                <div className="mt-3">
                  <h6>Installment Plans</h6>
                  {plan.subPlans.map((subPlan, subPlanIndex) => (
                    <div
                      key={subPlanIndex}
                      className="border p-3 mb-3 rounded bg-light"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Plan {subPlanIndex + 1}</h6>
                        {plan.subPlans.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              removeSubPlan(planIndex, subPlanIndex)
                            }
                          >
                            Remove Plan
                          </button>
                        )}
                      </div>

                      <FormGroup>
                        <Label>Installment Plan Title</Label>
                        <Input
                          type="text"
                          value={subPlan.installment_title}
                          onChange={(e) =>
                            handleSubPlanChange(
                              planIndex,
                              subPlanIndex,
                              "installment_title",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 3 Month Plan, 6 Month Plan"
                        />
                      </FormGroup>

                      <div className="row">
                        <div className="col-md-6">
                          <FormGroup>
                            <Label>Down Payment (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={subPlan.down_payment_percentage}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  planIndex,
                                  subPlanIndex,
                                  "down_payment_percentage",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-6">
                          <FormGroup>
                            <Label>Duration (Months)</Label>
                            <Input
                              type="select"
                              value={subPlan.duration}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  planIndex,
                                  subPlanIndex,
                                  "duration",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Duration</option>
                              {getDurationOptions().map((duration) => (
                                <option key={duration} value={duration}>
                                  {duration} Months
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-md-4">
                          <FormGroup>
                            <Label>
                              Advance Amount{" "}
                              <span className="text-success">
                                {/* (Auto-calculated) */}
                              </span>
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={subPlan.advance}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  planIndex,
                                  subPlanIndex,
                                  "advance",
                                  e.target.value
                                )
                              }
                              className="bg-light"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <Label>
                              Monthly Installment{" "}
                              <span className="text-success">
                                {/* (Auto-calculated) */}
                              </span>
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={subPlan.amount}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  planIndex,
                                  subPlanIndex,
                                  "amount",
                                  e.target.value
                                )
                              }
                              className="bg-light"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <Label>
                              Total Amount{" "}
                              <span className="text-success">
                                {/* (Auto-calculated) */}
                              </span>
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={subPlan.total_amount}
                              onChange={(e) =>
                                handleSubPlanChange(
                                  planIndex,
                                  subPlanIndex,
                                  "total_amount",
                                  e.target.value
                                )
                              }
                              className="bg-light"
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => addSubPlan(planIndex)}
                  >
                    Add Installment Plan
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={addPlan}
            >
              Add New Type
            </button>
          </div>
        </div>

        <div className="text-end">
          <Button type="submit" color="primary" disabled={isUploading}>
            {isUploading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddProduct;
