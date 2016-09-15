www.samesgate.co.uk

Installation Instructions
-------------------------

1) Clone the repository.
git clone git@github.com:bonzo45/samesgate.co.uk.git

2) Optional: use SASS to make changes to the CSS.
http://sass-lang.com/

cd css/
sass --watch styles.sass:styles.css

3) Optional: use bower to update the JavaScript dependencies.
https://www.npmjs.com/
https://bower.io/

npm install bower
npm install bower-installer

bower install
bower-installer

4) To release:

./release.sh
Copies all files required for release to release/