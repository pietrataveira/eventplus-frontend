import bannerEvento1 from "../../assets/banner-1.png";
import bannerEvento2 from "../../assets/banner-2.png";
import bannerEvento3 from "../../assets/banner-3.png";
import "./Carrossel.css";

const banners = [
    { imagem: bannerEvento1, alt: "Banner do primeiro evento em destaque" },
    { imagem: bannerEvento2, alt: "Banner do segundo evento em destaque" },
    { imagem: bannerEvento3, alt: "Banner do terceiro evento em destaque" }
];

function Carrossel() {
    return (
        <section
            id="carrosselEventPlus"
            className="carousel slide carrossel"
            data-bs-ride="carousel"
            data-bs-interval="8000"
            aria-label="Eventos em destaque"
        >
            <div className="carousel-indicators">
                {banners.map((banner, indice) => (
                    <button
                        key={banner.alt}
                        type="button"
                        data-bs-target="#carrosselEventPlus"
                        data-bs-slide-to={indice}
                        className={indice === 0 ? "active" : ""}
                        aria-current={indice === 0 ? "true" : undefined}
                        aria-label={`Banner ${indice + 1}`}
                    />
                ))}
            </div>

            <div className="carousel-inner">
                {banners.map((banner, indice) => (
                    <div key={banner.alt} className={`carousel-item ${indice === 0 ? "active" : ""}`}>
                        <img src={banner.imagem} className="carrossel-banner" alt={banner.alt} />
                    </div>
                ))}
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carrosselEventPlus" data-bs-slide="prev">
                <span className="carrossel-seta anterior" aria-hidden="true" />
                <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carrosselEventPlus" data-bs-slide="next">
                <span className="carrossel-seta" aria-hidden="true" />
                <span className="visually-hidden">Próximo</span>
            </button>
        </section>
    );
}

export default Carrossel;
