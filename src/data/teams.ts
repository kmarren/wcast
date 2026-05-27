// Power 4 conference NCAA D1 Women's Basketball teams.
// Logos via ESPN's public CDN.
export type Team = {
  id: string;
  name: string;
  short: string;
  conference: "SEC" | "Big Ten" | "ACC" | "Big 12";
  espnId: number;
  primary: string; // hex for team accent
};

export const logoUrl = (espnId: number) =>
  `https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`;

export const TEAMS: Team[] = [
  // SEC
  { id: "south-carolina", name: "South Carolina Gamecocks", short: "South Carolina", conference: "SEC", espnId: 2579, primary: "#73000A" },
  { id: "lsu", name: "LSU Tigers", short: "LSU", conference: "SEC", espnId: 99, primary: "#461D7C" },
  { id: "tennessee", name: "Tennessee Lady Vols", short: "Tennessee", conference: "SEC", espnId: 2633, primary: "#FF8200" },
  { id: "kentucky", name: "Kentucky Wildcats", short: "Kentucky", conference: "SEC", espnId: 96, primary: "#0033A0" },
  { id: "alabama", name: "Alabama Crimson Tide", short: "Alabama", conference: "SEC", espnId: 333, primary: "#9E1B32" },
  { id: "ole-miss", name: "Ole Miss Rebels", short: "Ole Miss", conference: "SEC", espnId: 145, primary: "#CE1126" },
  { id: "mississippi-state", name: "Mississippi State Bulldogs", short: "Mississippi St", conference: "SEC", espnId: 344, primary: "#660000" },
  { id: "florida", name: "Florida Gators", short: "Florida", conference: "SEC", espnId: 57, primary: "#0021A5" },
  { id: "georgia", name: "Georgia Bulldogs", short: "Georgia", conference: "SEC", espnId: 61, primary: "#BA0C2F" },
  { id: "arkansas", name: "Arkansas Razorbacks", short: "Arkansas", conference: "SEC", espnId: 8, primary: "#9D2235" },
  { id: "auburn", name: "Auburn Tigers", short: "Auburn", conference: "SEC", espnId: 2, primary: "#0C2340" },
  { id: "missouri", name: "Missouri Tigers", short: "Missouri", conference: "SEC", espnId: 142, primary: "#F1B82D" },
  { id: "texas-am", name: "Texas A&M Aggies", short: "Texas A&M", conference: "SEC", espnId: 245, primary: "#500000" },
  { id: "vanderbilt", name: "Vanderbilt Commodores", short: "Vanderbilt", conference: "SEC", espnId: 238, primary: "#000000" },
  { id: "oklahoma", name: "Oklahoma Sooners", short: "Oklahoma", conference: "SEC", espnId: 201, primary: "#841617" },
  { id: "texas", name: "Texas Longhorns", short: "Texas", conference: "SEC", espnId: 251, primary: "#BF5700" },

  // Big Ten
  { id: "iowa", name: "Iowa Hawkeyes", short: "Iowa", conference: "Big Ten", espnId: 2294, primary: "#FFCD00" },
  { id: "ucla", name: "UCLA Bruins", short: "UCLA", conference: "Big Ten", espnId: 26, primary: "#2D68C4" },
  { id: "usc", name: "USC Trojans", short: "USC", conference: "Big Ten", espnId: 30, primary: "#990000" },
  { id: "ohio-state", name: "Ohio State Buckeyes", short: "Ohio State", conference: "Big Ten", espnId: 194, primary: "#BB0000" },
  { id: "indiana", name: "Indiana Hoosiers", short: "Indiana", conference: "Big Ten", espnId: 84, primary: "#990000" },
  { id: "maryland", name: "Maryland Terrapins", short: "Maryland", conference: "Big Ten", espnId: 120, primary: "#E03A3E" },
  { id: "michigan", name: "Michigan Wolverines", short: "Michigan", conference: "Big Ten", espnId: 130, primary: "#00274C" },
  { id: "michigan-state", name: "Michigan State Spartans", short: "Michigan St", conference: "Big Ten", espnId: 127, primary: "#18453B" },
  { id: "nebraska", name: "Nebraska Cornhuskers", short: "Nebraska", conference: "Big Ten", espnId: 158, primary: "#E41C38" },
  { id: "illinois", name: "Illinois Fighting Illini", short: "Illinois", conference: "Big Ten", espnId: 356, primary: "#E84A27" },
  { id: "wisconsin", name: "Wisconsin Badgers", short: "Wisconsin", conference: "Big Ten", espnId: 275, primary: "#C5050C" },
  { id: "minnesota", name: "Minnesota Golden Gophers", short: "Minnesota", conference: "Big Ten", espnId: 135, primary: "#7A0019" },
  { id: "penn-state", name: "Penn State Nittany Lions", short: "Penn State", conference: "Big Ten", espnId: 213, primary: "#041E42" },
  { id: "purdue", name: "Purdue Boilermakers", short: "Purdue", conference: "Big Ten", espnId: 2509, primary: "#CEB888" },
  { id: "rutgers", name: "Rutgers Scarlet Knights", short: "Rutgers", conference: "Big Ten", espnId: 164, primary: "#CC0033" },
  { id: "northwestern", name: "Northwestern Wildcats", short: "Northwestern", conference: "Big Ten", espnId: 77, primary: "#4E2A84" },
  { id: "washington", name: "Washington Huskies", short: "Washington", conference: "Big Ten", espnId: 264, primary: "#4B2E83" },
  { id: "oregon", name: "Oregon Ducks", short: "Oregon", conference: "Big Ten", espnId: 2483, primary: "#154733" },

  // ACC
  { id: "notre-dame", name: "Notre Dame Fighting Irish", short: "Notre Dame", conference: "ACC", espnId: 87, primary: "#0C2340" },
  { id: "nc-state", name: "NC State Wolfpack", short: "NC State", conference: "ACC", espnId: 152, primary: "#CC0000" },
  { id: "duke", name: "Duke Blue Devils", short: "Duke", conference: "ACC", espnId: 150, primary: "#003087" },
  { id: "north-carolina", name: "North Carolina Tar Heels", short: "UNC", conference: "ACC", espnId: 153, primary: "#7BAFD4" },
  { id: "louisville", name: "Louisville Cardinals", short: "Louisville", conference: "ACC", espnId: 97, primary: "#AD0000" },
  { id: "virginia-tech", name: "Virginia Tech Hokies", short: "Virginia Tech", conference: "ACC", espnId: 259, primary: "#630031" },
  { id: "virginia", name: "Virginia Cavaliers", short: "Virginia", conference: "ACC", espnId: 258, primary: "#232D4B" },
  { id: "florida-state", name: "Florida State Seminoles", short: "Florida State", conference: "ACC", espnId: 52, primary: "#782F40" },
  { id: "miami", name: "Miami Hurricanes", short: "Miami", conference: "ACC", espnId: 2390, primary: "#F47321" },
  { id: "syracuse", name: "Syracuse Orange", short: "Syracuse", conference: "ACC", espnId: 183, primary: "#F76900" },
  { id: "boston-college", name: "Boston College Eagles", short: "Boston College", conference: "ACC", espnId: 103, primary: "#8A100B" },
  { id: "clemson", name: "Clemson Tigers", short: "Clemson", conference: "ACC", espnId: 228, primary: "#F66733" },
  { id: "georgia-tech", name: "Georgia Tech Yellow Jackets", short: "Georgia Tech", conference: "ACC", espnId: 59, primary: "#B3A369" },
  { id: "pittsburgh", name: "Pittsburgh Panthers", short: "Pittsburgh", conference: "ACC", espnId: 221, primary: "#003594" },
  { id: "wake-forest", name: "Wake Forest Demon Deacons", short: "Wake Forest", conference: "ACC", espnId: 154, primary: "#9E7E38" },
  { id: "stanford", name: "Stanford Cardinal", short: "Stanford", conference: "ACC", espnId: 24, primary: "#8C1515" },
  { id: "cal", name: "California Golden Bears", short: "Cal", conference: "ACC", espnId: 25, primary: "#003262" },
  { id: "smu", name: "SMU Mustangs", short: "SMU", conference: "ACC", espnId: 2567, primary: "#C8102E" },

  // Big 12
  { id: "baylor", name: "Baylor Bears", short: "Baylor", conference: "Big 12", espnId: 239, primary: "#003015" },
  { id: "kansas-state", name: "Kansas State Wildcats", short: "Kansas State", conference: "Big 12", espnId: 2306, primary: "#512888" },
  { id: "kansas", name: "Kansas Jayhawks", short: "Kansas", conference: "Big 12", espnId: 2305, primary: "#0051BA" },
  { id: "iowa-state", name: "Iowa State Cyclones", short: "Iowa State", conference: "Big 12", espnId: 66, primary: "#C8102E" },
  { id: "tcu", name: "TCU Horned Frogs", short: "TCU", conference: "Big 12", espnId: 2628, primary: "#4D1979" },
  { id: "oklahoma-state", name: "Oklahoma State Cowgirls", short: "Oklahoma St", conference: "Big 12", espnId: 197, primary: "#FF7300" },
  { id: "texas-tech", name: "Texas Tech Red Raiders", short: "Texas Tech", conference: "Big 12", espnId: 2641, primary: "#CC0000" },
  { id: "west-virginia", name: "West Virginia Mountaineers", short: "West Virginia", conference: "Big 12", espnId: 277, primary: "#002855" },
  { id: "cincinnati", name: "Cincinnati Bearcats", short: "Cincinnati", conference: "Big 12", espnId: 2132, primary: "#E00122" },
  { id: "houston", name: "Houston Cougars", short: "Houston", conference: "Big 12", espnId: 248, primary: "#C8102E" },
  { id: "byu", name: "BYU Cougars", short: "BYU", conference: "Big 12", espnId: 252, primary: "#002E5D" },
  { id: "ucf", name: "UCF Knights", short: "UCF", conference: "Big 12", espnId: 2116, primary: "#000000" },
  { id: "arizona", name: "Arizona Wildcats", short: "Arizona", conference: "Big 12", espnId: 12, primary: "#003366" },
  { id: "arizona-state", name: "Arizona State Sun Devils", short: "Arizona St", conference: "Big 12", espnId: 9, primary: "#8C1D40" },
  { id: "colorado", name: "Colorado Buffaloes", short: "Colorado", conference: "Big 12", espnId: 38, primary: "#CFB87C" },
  { id: "utah", name: "Utah Utes", short: "Utah", conference: "Big 12", espnId: 254, primary: "#CC0000" },
];

export const getTeam = (id: string) => TEAMS.find((t) => t.id === id);
