// CHRONO-PULSE Internationalization System

export type Language = 'fr' | 'en' | 'es' | 'ja';

export const SUPPORTED_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

// Translation keys (namespace: key)
type TranslationKeys = {
  // Start Screen
  'start.badge': string;
  'start.subtitle': string;
  'start.feature.slash': string;
  'start.feature.slash.key': string;
  'start.feature.slowmo': string;
  'start.feature.slowmo.key': string;
  'start.feature.dash': string;
  'start.feature.dash.key': string;
  'start.localBest': string;
  'start.button.start': string;
  'start.button.howToPlay': string;
  'start.button.highScores': string;
  'start.button.unmute': string;
  'start.button.mute': string;
  'start.button.audioOn': string;
  'start.proTip': string;
  'start.tipMobile': string;

  // HUD
  'hud.shield': string;
  'hud.chronoMatrix': string;
  'hud.wave': string;
  'hud.kills': string;
  'hud.totalScore': string;
  'hud.combo': string;
  'hud.survivalTime': string;
  'hud.difficulty.adaptive': string;
  'hud.difficulty.easy': string;
  'hud.difficulty.normal': string;
  'hud.difficulty.hard': string;
  'hud.aria.mute': string;
  'hud.aria.unmute': string;
  'hud.aria.pause': string;
  'hud.aria.resume': string;

  // Pause Overlay
  'pause.title': string;
  'pause.subtitle': string;
  'pause.resume': string;
  'pause.restart': string;
  'pause.audio.muted': string;
  'pause.audio.active': string;
  'pause.protocols': string;
  'pause.mainMenu': string;

  // Game Over
  'gameover.depleted': string;
  'gameover.terminated': string;
  'gameover.finalScore': string;
  'gameover.rank': string;
  'gameover.newRecord': string;
  'gameover.kills': string;
  'gameover.maxCombo': string;
  'gameover.survived': string;
  'gameover.restart': string;
  'gameover.highScores': string;
  'gameover.mainMenu': string;

  // Leaderboard
  'leaderboard.title': string;
  'leaderboard.empty': string;
  'leaderboard.clear': string;
  'leaderboard.close': string;
  'leaderboard.rank': string;
  'leaderboard.score': string;
  'leaderboard.kills': string;
  'leaderboard.combo': string;
  'leaderboard.time': string;
  'leaderboard.date': string;

  // How To Play
  'howtoplay.title': string;
  'howtoplay.close': string;
  'howtoplay.movement': string;
  'howtoplay.movement.desc': string;
  'howtoplay.aim': string;
  'howtoplay.aim.desc': string;
  'howtoplay.slash': string;
  'howtoplay.slash.desc': string;
  'howtoplay.dash': string;
  'howtoplay.dash.desc': string;
  'howtoplay.chrono': string;
  'howtoplay.chrono.desc': string;
  'howtoplay.deflect': string;
  'howtoplay.deflect.desc': string;
  'howtoplay.enemies': string;
  'howtoplay.pickups': string;
  'howtoplay.pickups.desc': string;
  'howtoplay.combo': string;
  'howtoplay.combo.desc': string;
  'howtoplay.tips': string;
  'howtoplay.tip1': string;
  'howtoplay.tip2': string;
  'howtoplay.tip3': string;
  'howtoplay.tip4': string;

  // Floating Text / Game Events
  'game.hit': string;
  'game.deflect': string;
  'game.combo': string;
  'game.chronoSurge': string;
  'game.shieldMatrix': string;
  'game.lifeBonus': string;

  // Rank Titles
  'rank.cyberOverlord': string;
  'rank.timeWeaver': string;
  'rank.chronoKnight': string;
  'rank.neonSlicer': string;
  'rank.gridInitiate': string;
  'rank.rookieOperator': string;

  // Language Selector
  'language.select': string;
};

// French translations
export const fr: TranslationKeys = {
  'start.badge': 'ARENE SYNTHWAVE TEMPS-RÉEL',
  'start.subtitle': 'Manipulez le temps, tranchez les drones cyber et renvoyez les lasers vers l\'essaim.',
  'start.feature.slash': 'SLASH & PARADE',
  'start.feature.slash.key': 'Espace / Tap',
  'start.feature.slowmo': 'RALENTI',
  'start.feature.slowmo.key': 'Shift / Maintenir',
  'start.feature.dash': 'DASH CYBER',
  'start.feature.dash.key': 'E / Dash',
  'start.localBest': 'MEILLEUR SCORE LOCAL: {score} PTS',
  'start.button.start': 'LANCER LE PROTOCOLE',
  'start.button.howToPlay': 'COMMENT JOUER',
  'start.button.highScores': 'MEILLEURS SCORES',
  'start.button.unmute': 'ACTIVER LE SON',
  'start.button.mute': 'COUPER LE SON',
  'start.button.audioOn': 'SON ACTIVÉ',
  'start.proTip': 'ASTUCE: Appuyez sur <kbd>ESPACE</kbd> ou <kbd>ENTRÉE</kbd> pour entrer directement au combat !',
  'start.tipMobile': 'MOBILE : touchez l\'arène pour viser et trancher !',

  'hud.shield': 'BOUCLIER',
  'hud.chronoMatrix': 'MATRICE CHRONO',
  'hud.wave': 'VAGUE',
  'hud.kills': 'ELIMINÉS',
  'hud.totalScore': 'SCORE TOTAL',
  'hud.combo': 'COMBO',
  'hud.survivalTime': 'TEMPS DE SURVIE',
  'hud.difficulty.adaptive': 'ADAPTATIF',
  'hud.difficulty.easy': 'FACILE',
  'hud.difficulty.normal': 'NORMAL',
  'hud.difficulty.hard': 'DIFFICILE',
  'hud.aria.mute': 'Couper le son',
  'hud.aria.unmute': 'Activer le son',
  'hud.aria.pause': 'Mettre en pause',
  'hud.aria.resume': 'Reprendre la partie',

  'pause.title': 'PAUSE',
  'pause.subtitle': 'SIMULATION SUSPENDUE',
  'pause.resume': 'REPRENDRE LE COMBAT',
  'pause.restart': 'RECOMMENCER MISSION',
  'pause.audio.muted': 'AUDIO: MIS EN SILENCE',
  'pause.audio.active': 'AUDIO: ACTIF',
  'pause.protocols': 'MANUEL DES PROTOCOLES',
  'pause.mainMenu': 'RETOUR AU MENU PRINCIPAL',

  'gameover.depleted': 'BOUCLIER CHRONO ÉPUISÉ',
  'gameover.terminated': 'MISSION TERMINÉE',
  'gameover.finalScore': 'SCORE FINAL',
  'gameover.rank': 'RANG',
  'gameover.newRecord': '★ NOUVEAU RECORD ★',
  'gameover.kills': 'ELIMINÉS',
  'gameover.maxCombo': 'MAX COMBO',
  'gameover.survived': 'SURVÉCU',
  'gameover.restart': 'RELANCER (ESPACE)',
  'gameover.highScores': 'VOIR MEILLEURS SCORES',
  'gameover.mainMenu': 'RETOUR AU MENU PRINCIPAL',

  'leaderboard.title': 'SALLE DES MAÎTRES',
  'leaderboard.empty': 'AUCUN SCORE ENREGISTRÉ',
  'leaderboard.clear': 'EFFACER',
  'leaderboard.close': 'FERMER',
  'leaderboard.rank': 'RANG',
  'leaderboard.score': 'SCORE',
  'leaderboard.kills': 'ELIM.',
  'leaderboard.combo': 'COMBO',
  'leaderboard.time': 'TEMPS',
  'leaderboard.date': 'DATE',

  'howtoplay.title': 'PROTOCOLES DE COMBAT',
  'howtoplay.close': 'FERMER',
  'howtoplay.movement': 'DÉPLACEMENT',
  'howtoplay.movement.desc': 'ZQSD / Flèches / Joystick gauche pour bouger dans les 8 directions.',
  'howtoplay.aim': 'VISÉE',
  'howtoplay.aim.desc': 'Souris / Joystick droit pour viser. Le personnage tourne automatiquement vers la cible.',
  'howtoplay.slash': 'LAMBDA SLASH',
  'howtoplay.slash.desc': 'Espace / Clic gauche / Bouton Slash. Attaque en arc de 120° devant vous. Tue les ennemis, PARADE les projectiles ennemis (les renvoie avec dégâts x2 !). Cooldown: 0.22s.',
  'howtoplay.dash': 'CYBER DASH',
  'howtoplay.dash.desc': 'E / F / Bouton Dash. Ruée directionnelle (750 unités/s) + invulnérabilité 0.25s. Cooldown: 0.65s. Sans direction = dash vers la visée.',
  'howtoplay.chrono': 'CHRONO SURGE (RALENTI)',
  'howtoplay.chrono.desc': 'Shift / C / Maintenir Chrono. Ralentit le monde à 0.22x (vous restez rapide !). Consomme l\'énergie Chrono (barre cyan). Relâchez pour revenir au temps normal. Regen passive quand inactif.',
  'howtoplay.deflect': 'PARADE PARFAITE',
  'howtoplay.deflect.desc': 'Slash au bon moment sur un projectile ennemi = DEFLECT ! Renvoie la balle x2 vitesse + dégâts + regain d\'énergie Chrono (+12). Screen shake + flash cyan.',
  'howtoplay.enemies': 'TYPES D\'ENNEMIS',
  'howtoplay.pickups': 'CAPSULES (DROP 28%)',
  'howtoplay.pickups.desc': 'Cyan = Énergie Chrono (+40). Vert = Bouclier (+1 PV, max 5). Attirées magnétiquement près de vous.',
  'howtoplay.combo': 'SYSTÈME DE COMBO',
  'howtoplay.combo.desc': 'Chaque kill dans les 2.4s augmente le combo. Score x (1 + combo × 0.2). Tous les 5 combos = CRIT (points bonus + flash or). Perdre des PV = combo reset.',
  'howtoplay.tips': 'ASTUCES PRO',
  'howtoplay.tip1': 'Parade (Deflect) > esquive. Renvoie les dégâts et recharge votre Chrono.',
  'howtoplay.tip2': 'Dash donne invulnérabilité. Traversez les balles au lieu de les éviter.',
  'howtoplay.tip3': 'Chrono Surge rend les patterns lisibles. Utilisez-le pour les vagues denses.',
  'howtoplay.tip4': 'Les SPLITTERS (ambre) se divisent en 2 mini-drones à la mort. Tuez-les en dernier.',

  'game.hit': 'TOUCHÉ',
  'game.deflect': 'PARADE !',
  'game.combo': 'x COMBO !',
  'game.chronoSurge': '+CHRONO SURGE',
  'game.shieldMatrix': '+BOUCLIER MATRICE',
  'game.lifeBonus': '+1 VIE',

  'rank.cyberOverlord': 'SEIGNEUR CYBER [S+]',
  'rank.timeWeaver': 'TISSEUR DU TEMPS [S]',
  'rank.chronoKnight': 'CHEVALIER CHRONO [A]',
  'rank.neonSlicer': 'TRANCHENEON [B]',
  'rank.gridInitiate': 'INITIÉ DE LA GRILLE [C]',
  'rank.rookieOperator': 'OPÉRATEUR DÉBUTANT [D]',

  'language.select': 'LANGUE',
};

// English translations
export const en: TranslationKeys = {
  'start.badge': 'SYNTHWAVE TIME-SURGE ARENA',
  'start.subtitle': 'Warp time, slash cyber drones, and deflect incoming lasers back at the swarm.',
  'start.feature.slash': 'SLASH & DEFLECT',
  'start.feature.slash.key': 'Space / Tap',
  'start.feature.slowmo': 'SLOW MOTION',
  'start.feature.slowmo.key': 'Shift / Hold',
  'start.feature.dash': 'CYBER DASH',
  'start.feature.dash.key': 'E / Dash',
  'start.localBest': 'LOCAL BEST RECORD: {score} PTS',
  'start.button.start': 'INITIATE PROTOCOL (START)',
  'start.button.howToPlay': 'HOW TO PLAY',
  'start.button.highScores': 'HIGH SCORES',
  'start.button.unmute': 'UNMUTE',
  'start.button.mute': 'MUTE',
  'start.button.audioOn': 'AUDIO ON',
  'start.proTip': 'PRO-TIP: Press <kbd>SPACE</kbd> or <kbd>ENTER</kbd> to jump straight into combat!',
  'start.tipMobile': 'MOBILE: tap the arena to aim & slash!',

  'hud.shield': 'SHIELD',
  'hud.chronoMatrix': 'CHRONO MATRIX',
  'hud.wave': 'WAVE',
  'hud.kills': 'KILLS',
  'hud.totalScore': 'TOTAL SCORE',
  'hud.combo': 'COMBO',
  'hud.survivalTime': 'SURVIVAL TIME',
  'hud.difficulty.adaptive': 'ADAPTIVE',
  'hud.difficulty.easy': 'EASY',
  'hud.difficulty.normal': 'NORMAL',
  'hud.difficulty.hard': 'HARD',
  'hud.aria.mute': 'Mute audio',
  'hud.aria.unmute': 'Unmute audio',
  'hud.aria.pause': 'Pause game',
  'hud.aria.resume': 'Resume game',

  'pause.title': 'PAUSED',
  'pause.subtitle': 'SIMULATION SUSPENDED',
  'pause.resume': 'RESUME COMBAT',
  'pause.restart': 'RESTART MISSION',
  'pause.audio.muted': 'AUDIO: MUTED',
  'pause.audio.active': 'AUDIO: ACTIVE',
  'pause.protocols': 'PROTOCOLS MANUAL',
  'pause.mainMenu': 'RETURN TO MAIN MENU',

  'gameover.depleted': 'CHRONO SHIELD DEPLETED',
  'gameover.terminated': 'MISSION TERMINATED',
  'gameover.finalScore': 'FINAL SCORE',
  'gameover.rank': 'RANK',
  'gameover.newRecord': '★ NEW RECORD HIGH SCORE ★',
  'gameover.kills': 'KILLS',
  'gameover.maxCombo': 'MAX COMBO',
  'gameover.survived': 'SURVIVED',
  'gameover.restart': 'INSTANT RESTART (SPACE)',
  'gameover.highScores': 'VIEW HIGH SCORES',
  'gameover.mainMenu': 'RETURN TO MAIN MENU',

  'leaderboard.title': 'HALL OF MASTERS',
  'leaderboard.empty': 'NO SCORES RECORDED',
  'leaderboard.clear': 'CLEAR',
  'leaderboard.close': 'CLOSE',
  'leaderboard.rank': 'RANK',
  'leaderboard.score': 'SCORE',
  'leaderboard.kills': 'KILLS',
  'leaderboard.combo': 'COMBO',
  'leaderboard.time': 'TIME',
  'leaderboard.date': 'DATE',

  'howtoplay.title': 'COMBAT PROTOCOLS',
  'howtoplay.close': 'CLOSE',
  'howtoplay.movement': 'MOVEMENT',
  'howtoplay.movement.desc': 'WASD / Arrow Keys / Left Joystick to move in 8 directions.',
  'howtoplay.aim': 'AIM',
  'howtoplay.aim.desc': 'Mouse / Right Joystick to aim. Character auto-faces the target.',
  'howtoplay.slash': 'ENERGY BLADE SLASH',
  'howtoplay.slash.desc': 'Space / Left Click / Slash Button. 120° arc attack in front of you. Kills enemies, PARRIES enemy projectiles (reflects them back at 2x damage!). Cooldown: 0.22s.',
  'howtoplay.dash': 'CYBER DASH',
  'howtoplay.dash.desc': 'E / F / Dash Button. Directional burst (750 units/s) + 0.25s invulnerability. Cooldown: 0.65s. No input = dash towards aim.',
  'howtoplay.chrono': 'CHRONO SURGE (SLOW-MO)',
  'howtoplay.chrono.desc': 'Shift / C / Hold Chrono. Slows world to 0.22x (you stay fast!). Consumes Chrono Energy (cyan bar). Release to resume normal time. Passive regen when inactive.',
  'howtoplay.deflect': 'PERFECT PARRY',
  'howtoplay.deflect.desc': 'Slash at the right moment on enemy projectile = DEFLECT! Reflects bullet at 2x speed/damage + Chrono energy gain (+12). Screen shake + cyan flash.',
  'howtoplay.enemies': 'ENEMY TYPES',
  'howtoplay.pickups': 'CAPSULES (28% DROP)',
  'howtoplay.pickups.desc': 'Cyan = Chrono Energy (+40). Green = Shield (+1 HP, max 5). Magnetically attracted when near.',
  'howtoplay.combo': 'COMBO SYSTEM',
  'howtoplay.combo.desc': 'Each kill within 2.4s increases combo. Score x (1 + combo × 0.2). Every 5 combos = CRIT (bonus points + gold flash). Taking damage = combo reset.',
  'howtoplay.tips': 'PRO TIPS',
  'howtoplay.tip1': 'Parry (Deflect) > dodge. Returns damage AND recharges your Chrono.',
  'howtoplay.tip2': 'Dash grants invulnerability. Dash THROUGH bullets instead of dodging.',
  'howtoplay.tip3': 'Chrono Surge makes patterns readable. Use it for dense waves.',
  'howtoplay.tip4': 'SPLITTERS (amber) split into 2 mini-drones on death. Kill them last.',

  'game.hit': 'HIT',
  'game.deflect': 'DEFLECT!',
  'game.combo': 'x COMBO!',
  'game.chronoSurge': '+CHRONO SURGE',
  'game.shieldMatrix': '+SHIELD MATRIX',
  'game.lifeBonus': '+1 LIFE',

  'rank.cyberOverlord': 'CYBER OVERLORD [S+]',
  'rank.timeWeaver': 'TIME WEAVER [S]',
  'rank.chronoKnight': 'CHRONO KNIGHT [A]',
  'rank.neonSlicer': 'NEON SLICER [B]',
  'rank.gridInitiate': 'GRID INITIATE [C]',
  'rank.rookieOperator': 'ROOKIE OPERATOR [D]',

  'language.select': 'LANGUAGE',
};

// Spanish translations
export const es: TranslationKeys = {
  'start.badge': 'ARENA SINTHWAVE TIEMPO-REAL',
  'start.subtitle': 'Manipula el tiempo, corta drones cibernéticos y devuelve los láseres al enjambre.',
  'start.feature.slash': 'TAJO Y PARADA',
  'start.feature.slash.key': 'Espacio / Tap',
  'start.feature.slowmo': 'CÁMARA LENTA',
  'start.feature.slowmo.key': 'Shift / Mantener',
  'start.feature.dash': 'DASH CIBER',
  'start.feature.dash.key': 'E / Dash',
  'start.localBest': 'MEJOR RÉCORD LOCAL: {score} PTS',
  'start.button.start': 'INICIAR PROTOCOLO',
  'start.button.howToPlay': 'CÓMO JUGAR',
  'start.button.highScores': 'MEJORES PUNTUACIONES',
  'start.button.unmute': 'ACTIVAR SONIDO',
  'start.button.mute': 'SILENCIAR',
  'start.button.audioOn': 'SONIDO ACTIVO',
  'start.proTip': 'CONSEJO: Pulsa <kbd>ESPACIO</kbd> o <kbd>ENTRADA</kbd> para saltar directo al combate!',
  'start.tipMobile': 'MÓVIL: ¡toca la arena para apuntar y cortar!',

  'hud.shield': 'ESCUDO',
  'hud.chronoMatrix': 'MATRIZ CHRONO',
  'hud.wave': 'OLEADA',
  'hud.kills': 'ELIMINADOS',
  'hud.totalScore': 'PUNTUACIÓN TOTAL',
  'hud.combo': 'COMBO',
  'hud.survivalTime': 'TIEMPO DE SUPERVIVENCIA',
  'hud.difficulty.adaptive': 'ADAPTATIVO',
  'hud.difficulty.easy': 'FÁCIL',
  'hud.difficulty.normal': 'NORMAL',
  'hud.difficulty.hard': 'DIFÍCIL',
  'hud.aria.mute': 'Silenciar audio',
  'hud.aria.unmute': 'Activar sonido',
  'hud.aria.pause': 'Pausar juego',
  'hud.aria.resume': 'Reanudar juego',

  'pause.title': 'PAUSA',
  'pause.subtitle': 'SIMULACIÓN SUSPENDIDA',
  'pause.resume': 'REANUDAR COMBATE',
  'pause.restart': 'REINICIAR MISIÓN',
  'pause.audio.muted': 'AUDIO: SILENCIADO',
  'pause.audio.active': 'AUDIO: ACTIVO',
  'pause.protocols': 'MANUAL DE PROTOCOLOS',
  'pause.mainMenu': 'VOLVER AL MENÚ PRINCIPAL',

  'gameover.depleted': 'ESCUDO CHRONO AGOTADO',
  'gameover.terminated': 'MISIÓN TERMINADA',
  'gameover.finalScore': 'PUNTUACIÓN FINAL',
  'gameover.rank': 'RANGO',
  'gameover.newRecord': '★ NUEVO RÉCORD ★',
  'gameover.kills': 'ELIMINADOS',
  'gameover.maxCombo': 'MAX COMBO',
  'gameover.survived': 'SUPERVIVIDO',
  'gameover.restart': 'REINICIO INSTANTÁNEO (ESPACIO)',
  'gameover.highScores': 'VER MEJORES PUNTUACIONES',
  'gameover.mainMenu': 'VOLVER AL MENÚ PRINCIPAL',

  'leaderboard.title': 'SALÓN DE MAESTROS',
  'leaderboard.empty': 'SIN PUNTUACIONES REGISTRADAS',
  'leaderboard.clear': 'BORRAR',
  'leaderboard.close': 'CERRAR',
  'leaderboard.rank': 'RANGO',
  'leaderboard.score': 'PUNTOS',
  'leaderboard.kills': 'ELIM.',
  'leaderboard.combo': 'COMBO',
  'leaderboard.time': 'TIEMPO',
  'leaderboard.date': 'FECHA',

  'howtoplay.title': 'PROTOCOLOS DE COMBATE',
  'howtoplay.close': 'CERRAR',
  'howtoplay.movement': 'MOVIMIENTO',
  'howtoplay.movement.desc': 'WASD / Flechas / Joystick izq. para moverse en 8 direcciones.',
  'howtoplay.aim': 'MIRA',
  'howtoplay.aim.desc': 'Ratón / Joystick der. para apuntar. El personaje gira automáticamente hacia el objetivo.',
  'howtoplay.slash': 'TAJO DE HOJA DE ENERGÍA',
  'howtoplay.slash.desc': 'Espacio / Clic izq. / Botón Tajo. Ataque en arco de 120° frente a ti. Mata enemigos, PARA proyectiles enemigos (¡los devuelve con daño x2!). Enfriamiento: 0.22s.',
  'howtoplay.dash': 'DASH CIBER',
  'howtoplay.dash.desc': 'E / F / Botón Dash. Impulso direccional (750 u/s) + invulnerabilidad 0.25s. Enfriamiento: 0.65s. Sin dirección = dash hacia la mira.',
  'howtoplay.chrono': 'CHRONO SURGE (CÁMARA LENTA)',
  'howtoplay.chrono.desc': 'Shift / C / Mantener Chrono. Ralentiza el mundo a 0.22x (¡tú sigues rápido!). Consume Energía Chrono (barra cian). Suelta para volver al tiempo normal. Regeneración pasiva cuando inactivo.',
  'howtoplay.deflect': 'PARADA PERFECTA',
  'howtoplay.deflect.desc': 'Tajo en el momento justo sobre proyectil enemigo = DESVÍO! Devuelve la bala x2 velocidad/daño + gana energía Chrono (+12). Sacudida de pantalla + flash cian.',
  'howtoplay.enemies': 'TIPOS DE ENEMIGOS',
  'howtoplay.pickups': 'CÁPSULAS (DROP 28%)',
  'howtoplay.pickups.desc': 'Cian = Energía Chrono (+40). Verde = Escudo (+1 PV, máx 5). Atraídas magnéticamente cerca de ti.',
  'howtoplay.combo': 'SISTEMA DE COMBO',
  'howtoplay.combo.desc': 'Cada kill en 2.4s aumenta el combo. Puntuación x (1 + combo × 0.2). Cada 5 combos = CRIT (puntos extra + flash oro). Recibir daño = combo reseteado.',
  'howtoplay.tips': 'CONSEJOS PRO',
  'howtoplay.tip1': 'Parada (Desvío) > esquivar. Devuelve daño Y recarga tu Chrono.',
  'howtoplay.tip2': 'Dash da invulnerabilidad. Atraviesa las balas en lugar de esquivarlas.',
  'howtoplay.tip3': 'Chrono Surge hace los patrones legibles. Úsalo para oleadas densas.',
  'howtoplay.tip4': 'Los SPLITTERS (ámbar) se dividen en 2 mini-drones al morir. Mátalos al final.',

  'game.hit': 'IMPACTO',
  'game.deflect': '¡DESVÍO!',
  'game.combo': 'x COMBO!',
  'game.chronoSurge': '+CHRONO SURGE',
  'game.shieldMatrix': '+ESCUDO MATRIZ',
  'game.lifeBonus': '+1 VIDA',

  'rank.cyberOverlord': 'SEÑOR CIBER [S+]',
  'rank.timeWeaver': 'TEJEDOR DEL TIEMPO [S]',
  'rank.chronoKnight': 'CABALLERO CHRONO [A]',
  'rank.neonSlicer': 'CORTANEÓN [B]',
  'rank.gridInitiate': 'INICIADO DE LA RED [C]',
  'rank.rookieOperator': 'OPERADOR NOVATO [D]',

  'language.select': 'IDIOMA',
};

// Japanese translations
export const ja: TranslationKeys = {
  'start.badge': 'シンセウェイブ タイムサージ アリーナ',
  'start.subtitle': '時間を操り、サイバードローンを斬り、レーザーを群れに跳ね返せ。',
  'start.feature.slash': '斬撃 & パリィ',
  'start.feature.slash.key': 'スペース / タップ',
  'start.feature.slowmo': 'スローモーション',
  'start.feature.slowmo.key': 'Shift / 長押し',
  'start.feature.dash': 'サイバーダッシュ',
  'start.feature.dash.key': 'E / ダッシュ',
  'start.localBest': 'ローカル最高記録: {score} PTS',
  'start.button.start': 'プロトコル開始',
  'start.button.howToPlay': '遊び方',
  'start.button.highScores': 'ハイスコア',
  'start.button.unmute': 'ミュート解除',
  'start.button.mute': 'ミュート',
  'start.button.audioOn': '音声オン',
  'start.proTip': 'ヒント: <kbd>スペース</kbd> または <kbd>エンター</kbd> で即戦闘開始!',
  'start.tipMobile': 'モバイル: アリーナをタップで照準＆斬撃!',

  'hud.shield': 'シールド',
  'hud.chronoMatrix': 'クロノマトリックス',
  'hud.wave': 'ウェーブ',
  'hud.kills': '撃破数',
  'hud.totalScore': '総合スコア',
  'hud.combo': 'コンボ',
  'hud.survivalTime': '生存時間',
  'hud.difficulty.adaptive': '適応的',
  'hud.difficulty.easy': 'イージー',
  'hud.difficulty.normal': 'ノーマル',
  'hud.difficulty.hard': 'ハード',
  'hud.aria.mute': 'ミュート',
  'hud.aria.unmute': 'ミュート解除',
  'hud.aria.pause': '一時停止',
  'hud.aria.resume': 'ゲーム再開',

  'pause.title': '一時停止',
  'pause.subtitle': 'シミュレーション中断',
  'pause.resume': '戦闘再開',
  'pause.restart': 'ミッション再開',
  'pause.audio.muted': '音声: ミュート',
  'pause.audio.active': '音声: オン',
  'pause.protocols': 'プロトコルマニュアル',
  'pause.mainMenu': 'メインメニューに戻る',

  'gameover.depleted': 'クロノシールド枯渇',
  'gameover.terminated': 'ミッション終了',
  'gameover.finalScore': '最終スコア',
  'gameover.rank': 'ランク',
  'gameover.newRecord': '★ 新記録 ★',
  'gameover.kills': '撃破数',
  'gameover.maxCombo': '最大コンボ',
  'gameover.survived': '生存時間',
  'gameover.restart': '即時リスタート (スペース)',
  'gameover.highScores': 'ハイスコアを見る',
  'gameover.mainMenu': 'メインメニューに戻る',

  'leaderboard.title': '達人の殿堂',
  'leaderboard.empty': '記録なし',
  'leaderboard.clear': 'クリア',
  'leaderboard.close': '閉じる',
  'leaderboard.rank': 'ランク',
  'leaderboard.score': 'スコア',
  'leaderboard.kills': '撃破',
  'leaderboard.combo': 'コンボ',
  'leaderboard.time': '時間',
  'leaderboard.date': '日付',

  'howtoplay.title': '戦闘プロトコル',
  'howtoplay.close': '閉じる',
  'howtoplay.movement': '移動',
  'howtoplay.movement.desc': 'WASD / 矢印キー / 左スティックで8方向移動。',
  'howtoplay.aim': '照準',
  'howtoplay.aim.desc': 'マウス / 右スティックで照準。キャラは自動でターゲットを向く。',
  'howtoplay.slash': 'エナジーブレード斬撃',
  'howtoplay.slash.desc': 'スペース / 左クリック / 斬撃ボタン。前方120°の弧状攻撃。敵を倒し、敵の弾をパリィ(2倍ダメージで跳ね返す!)クールダウン: 0.22秒。',
  'howtoplay.dash': 'サイバーダッシュ',
  'howtoplay.dash.desc': 'E / F / ダッシュボタン。方向バースト(750u/s) + 0.25秒無敵。クールダウン: 0.65秒。入力なし = 照準方向へダッシュ。',
  'howtoplay.chrono': 'クロノサージ(スローモーション)',
  'howtoplay.chrono.desc': 'Shift / C / クロノ長押し。世界を0.22倍速に(プレイヤーは高速のまま!)クロノエネルギー(シアンバー)を消費。離すと通常速度に。非使用時に自然回復。',
  'howtoplay.deflect': 'パーフェクトパリィ',
  'howtoplay.deflect.desc': '敵の弾にタイミングよく斬撃 = パリィ! 弾を2倍速/ダメージで反射 + クロノエネルギー回復(+12)。画面揺れ + シアンフラッシュ。',
  'howtoplay.enemies': '敵タイプ',
  'howtoplay.pickups': 'カプセル(ドロップ 28%)',
  'howtoplay.pickups.desc': 'シアン = クロノエネルギー(+40)。緑 = シールド(+1HP、最大5)。近くで磁力で引き寄せられる。',
  'howtoplay.combo': 'コンボシステム',
  'howtoplay.combo.desc': '2.4秒以内のキルでコンボ上昇。スコア x (1 + コンボ × 0.2)。5コンボごと = クリット(ボーナス点 + 金フラッシュ)。被弾 = コンボリセット。',
  'howtoplay.tips': 'プロのヒント',
  'howtoplay.tip1': 'パリィ > 回避。ダメージを返しつつクロノも回復。',
  'howtoplay.tip2': 'ダッシュで無敵。弾を避けるのではなく「貫く」。',
  'howtoplay.tip3': 'クロノサージでパターンが見やすく。密集ウェーブで使え。',
  'howtoplay.tip4': 'スプリッター(琥珀色)は死亡時にミニドローン2体に分裂。最後に倒せ。',

  'game.hit': 'ヒット',
  'game.deflect': 'パリィ!',
  'game.combo': 'x コンボ!',
  'game.chronoSurge': '+クロノサージ',
  'game.shieldMatrix': '+シールドマトリックス',
  'game.lifeBonus': '+1 ライフ',

  'rank.cyberOverlord': 'サイバーオーバーロード [S+]',
  'rank.timeWeaver': 'タイムウィーバー [S]',
  'rank.chronoKnight': 'クロノナイト [A]',
  'rank.neonSlicer': 'ネオンスライサー [B]',
  'rank.gridInitiate': 'グリッド入門者 [C]',
  'rank.rookieOperator': 'ルーキーオペレーター [D]',

  'language.select': '言語',
};

// Translation map
export const translations: Record<Language, TranslationKeys> = {
  fr,
  en,
  es,
  ja,
};

// Helper to get translation with interpolation
export function t(lang: Language, key: keyof TranslationKeys, params?: Record<string, string | number>): string {
  let text = translations[lang][key] || translations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}

// Maps a stored English rank title (from high score records) to the localized version
const RANK_TITLE_MAP: Record<string, keyof TranslationKeys> = {
  'CYBER OVERLORD [S+]': 'rank.cyberOverlord',
  'TIME WEAVER [S]': 'rank.timeWeaver',
  'CHRONO KNIGHT [A]': 'rank.chronoKnight',
  'NEON SLICER [B]': 'rank.neonSlicer',
  'GRID INITIATE [C]': 'rank.gridInitiate',
  'ROOKIE OPERATOR [D]': 'rank.rookieOperator',
};

export function tRank(lang: Language, rankTitle: string): string {
  const key = RANK_TITLE_MAP[rankTitle];
  return key ? t(lang, key) : rankTitle;
}