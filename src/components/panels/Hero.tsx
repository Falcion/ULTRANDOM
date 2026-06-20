import './Hero.css'

export function Hero() {
    return (
        < header className="hero-panel panel" >
            <div className="hero-panel__topline">
                <div className="hero-tag">ULTRAKILL LEVEL RANDOMIZER</div>
                <div className="hero-tag hero-tag--muted">BOILING BLOOD...</div>
            </div>
            <h1 className="hero-title">ULTRANDOM</h1>
            <p className="hero-copy">
                Select level types, set the count, and parry RANDOMIZE. Open SETTINGS to tune the pool, wallpaper, audio, and challenge odds.
            </p>
        </header >
    );
}