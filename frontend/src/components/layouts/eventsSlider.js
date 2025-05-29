import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getAllEvents } from "../../api/userServices";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const EventsSlider = () => {
  const [newestEvents, setNewestEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        const sorted = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setNewestEvents(sorted);
      } catch (error) {
        console.error("Error fetching newest events:", error);
      }
    };

    fetchEvents();
  }, []);

  const settings = {
    centerMode: true,
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerPadding: "15%",
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: 0, padding: 0, display: "flex", gap: "8px" }}>
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
        <span className="custom-dot" />
      ),
      
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Slider {...settings}>
        {newestEvents.map((event) => (
          <div
            key={event._id}
            style={{
              padding: "0 10px", // Add small horizontal padding
              boxSizing: "border-box",
              cursor: "pointer",
              position: "relative",
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}
            onClick={() => navigate(`/events/${event._id}`)}
          >
            <img
              src={event.image}
              alt={event.title}
              style={{
                width: "100%",
                height: "70vh",
                objectFit: "cover",
                borderRadius: "0",
              }}
            />
            {/* Info overlay remains the same */}
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "30px",
                right: "30px",
                backgroundColor: "rgba(0, 0, 0, 0.64)",
                color: "#fff",
                padding: "20px",
                borderRadius: "8px",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                transform: "translateY(10px)",
                opacity: 0.9,
                maxWidth: "calc(100% - 60px)",
                ":hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  transform: "translateY(0)",
                  opacity: 1,
                },
              }}
            >
              {/* Title and date/location info remains the same */}
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  lineHeight: "1.3",
                  letterSpacing: "0.5px",
                }}
              >
                {event.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.9rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  {event.location}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
  .slick-slide > div {
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: scale(0.9);
    opacity: 0.6;
    cursor: default;
  }

  .slick-center > div {
    transform: scale(1);
    opacity: 1;
    cursor: pointer;
  }

  .slick-list {
    margin: 0 -10px;
  }

  .slick-dots li button:before {
    content: none !important;
  }

  .custom-dot {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    background-color: transparent;
    opacity: 0.6;
    transition: background-color 0.3s, opacity 0.3s;
  }

  .slick-dots li.slick-active .custom-dot {
    background-color: white;
    opacity: 1;
  }

  .slick-dots {
    bottom: 15px !important;
  }

  body {
    overflow-x: hidden;
  }
`}</style>

    </div>
  );
};

export default EventsSlider;
