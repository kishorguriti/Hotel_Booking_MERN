import React from "react";
import MyNavbar from "../../components/MyNavbar";
import Header from "../../components/Header";
import { Container } from "react-bootstrap";
import Featured from "../../components/Featured";
import FeaturedProperty from "../../components/FeaturdProperties";
import PropertyList from "../../components/PropertyList";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

function Home() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <MyNavbar />
      <Header />
      <div className="mt-5 p-3">
        <Featured />
      </div>
      <Container>
        <h3 style={{ fontWeight: "bold" }}>{t("Browse by property")}</h3>
        <PropertyList />
      </Container>
      <Container className="mb-4">
        <h3 style={{ fontWeight: "bold" }}>{t("Homes guests love")}</h3>
        <FeaturedProperty />
      </Container>
      <Footer />
    </>
  );
}

export default Home;
