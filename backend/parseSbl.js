const fs = require('fs');

const html = fs.readFileSync('sbl_raw.html', 'utf8');

// Looking for __NEXT_DATA__
let m = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
if (m) {
  let data = JSON.parse(m[1]);
  // Usually in props.pageProps.initialState or similar
  console.log("Found NEXT_DATA. Keys in props:", Object.keys(data.props));
  fs.writeFileSync('sbl_next_data.json', JSON.stringify(data, null, 2));
  console.log("Saved to sbl_next_data.json");
} else {
  // Try looking for angular state or window.__INITIAL_STATE__
  m = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);
  if (m) {
    console.log("Found INITIAL_STATE");
  } else {
    // try to find any array of objects with "name" and "image"
    let productsMatch = html.match(/"products"\s*:\s*(\[.+?\])/);
    if (productsMatch) {
       console.log("Found products json array");
    } else {
       console.log("Could not find state objects. The page might be rendered completely client side with an external API call. Let's dump links.");
       
       let links = html.match(/https?:\/\/[^"'\s>]+/g);
       if (links) {
           console.log("Some links found:", links.filter(l => l.includes('api') || l.includes('product')).slice(0, 10));
       }
    }
  }
}
