// components/dashboard/TopCards.js
import React from "react";
import { Card, CardBody } from "reactstrap";

const TopCards = ({
  title,
  subtitle,
  earning,
  icon,
  bg,
  trend = null,
  trendDirection = "up"
}) => {
  // Color schemes for different card types
  const colorSchemes = {
    "today-orders": {
      gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#64b5f6"
    },
    "pending-orders": {
      gradient: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#ffab40"
    },
    "today-accepted": {
      gradient: "linear-gradient(135deg, #00c851 0%, #007e33 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#4caf50"
    },
    "total-accepted": {
      gradient: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#26c6da"
    },
    "today-delivered": {
      gradient: "linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#ab47bc"
    },
    "total-delivered": {
      gradient: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#66bb6a"
    },
    "today-users": {
      gradient: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#ef5350"
    },
    "total-users": {
      gradient: "linear-gradient(135deg, #512da8 0%, #311b92 100%)",
      bgClass: "shadow-lg border-0",
      textColor: "text-white",
      iconBg: "rgba(255,255,255,0.15)",
      iconColor: "#ffffff",
      accentColor: "#7986cb"
    }
  };

  // Determine color scheme based on subtitle
  const getColorScheme = (subtitle) => {
    const subtitleLower = subtitle.toLowerCase();

    if (
      subtitleLower.includes("today's orders") ||
      subtitleLower.includes("today orders")
    ) {
      return colorSchemes["today-orders"];
    } else if (subtitleLower.includes("pending")) {
      return colorSchemes["pending-orders"];
    } else if (
      subtitleLower.includes("today") &&
      subtitleLower.includes("accepted")
    ) {
      return colorSchemes["today-accepted"];
    } else if (
      subtitleLower.includes("total") &&
      subtitleLower.includes("accepted")
    ) {
      return colorSchemes["total-accepted"];
    } else if (
      subtitleLower.includes("today") &&
      subtitleLower.includes("delivered")
    ) {
      return colorSchemes["today-delivered"];
    } else if (
      subtitleLower.includes("total") &&
      subtitleLower.includes("delivered")
    ) {
      return colorSchemes["total-delivered"];
    } else if (
      subtitleLower.includes("today") &&
      subtitleLower.includes("users")
    ) {
      return colorSchemes["today-users"];
    } else if (
      subtitleLower.includes("total") &&
      subtitleLower.includes("users")
    ) {
      return colorSchemes["total-users"];
    }
    return colorSchemes["today-orders"];
  };

  const colorScheme = getColorScheme(subtitle);

  // Get appropriate icon based on card type
  const getCardIcon = () => {
    const subtitleLower = subtitle.toLowerCase();

    if (subtitleLower.includes("order")) {
      return "bi bi-cart-check-fill";
    } else if (subtitleLower.includes("pending")) {
      return "bi bi-hourglass-split";
    } else if (subtitleLower.includes("accepted")) {
      return "bi bi-check-circle-fill";
    } else if (subtitleLower.includes("delivered")) {
      return "bi bi-truck";
    } else if (subtitleLower.includes("users")) {
      return "bi bi-people-fill";
    }
    return icon || "bi bi-graph-up-arrow";
  };

  const cardIcon = getCardIcon();

  // Card styles
  const cardStyle = {
    background: colorScheme.gradient,
    border: "none",
    borderRadius: "20px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    height: "160px",
    width: "100%"
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255,255,255,0.08)",
    opacity: 0,
    transition: "opacity 0.3s ease"
  };

  return (
    <Card
      className={`${colorScheme.bgClass} mb-3`}
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
        const overlay = e.currentTarget.querySelector(".card-overlay");
        if (overlay) overlay.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
        const overlay = e.currentTarget.querySelector(".card-overlay");
        if (overlay) overlay.style.opacity = "0";
      }}
    >
      <div className="card-overlay" style={overlayStyle}></div>

      <CardBody className="p-4 h-100 d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between h-100">
          <div className="flex-grow-1 d-flex flex-column justify-content-between h-100">
            {/* Subtitle */}
            <p
              className="mb-2"
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "#ffffff",
                opacity: "0.95",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                lineHeight: "1.2"
              }}
            >
              {subtitle}
            </p>

            {/* Main Value */}
            <div className="flex-grow-1 d-flex align-items-center">
              <h2
                className="mb-0"
                style={{
                  fontSize: "2.2rem",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  color: "#ffffff",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                {typeof earning === "number"
                  ? earning.toLocaleString()
                  : earning || "0"}
              </h2>
            </div>

            {/* Title */}
            <p
              className="mb-2"
              style={{
                fontSize: "0.78rem",
                fontWeight: "500",
                color: "#ffffff",
                opacity: "0.9",
                lineHeight: "1.3"
              }}
            >
              {title}
            </p>

            {/* Trend Indicator */}
            {trend && (
              <div
                className="d-flex align-items-center"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "#ffffff",
                  background: "rgba(255,255,255,0.1)",
                  padding: "4px 10px",
                  borderRadius: "15px",
                  display: "inline-flex",
                  backdropFilter: "blur(10px)"
                }}
              >
                <i
                  className={`bi ${
                    trendDirection === "up" ? "bi-arrow-up" : "bi-arrow-down"
                  } me-1`}
                  style={{
                    color: trendDirection === "up" ? "#4caf50" : "#f44336",
                    fontSize: "0.8rem"
                  }}
                ></i>
                <span>{trend}% vs last month</span>
              </div>
            )}
          </div>

          {/* Icon Section */}
          <div
            style={{
              backgroundColor: colorScheme.iconBg,
              borderRadius: "16px",
              padding: "16px",
              marginLeft: "16px",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              flexShrink: 0
            }}
          >
            <i
              className={cardIcon}
              style={{
                fontSize: "1.6rem",
                color: colorScheme.iconColor,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            ></i>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${colorScheme.accentColor}, rgba(255,255,255,0.3))`,
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px"
          }}
        ></div>

        {/* Subtle pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100px",
            height: "100px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
            opacity: "0.3"
          }}
        ></div>
      </CardBody>
    </Card>
  );
};

export default TopCards;
