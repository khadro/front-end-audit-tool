To test the JS on a website use the following command in a bash or bash-like shell (wsl for windows is the easiest):

`yarn eslint [path to the js file to test]`

This will take the path, and run ESLint using our local configuration (rather than looking for one at the destination).

*Notes*
`@ronilaukkarinen/stylelint-a11y` is used as a replacement for `stylelint-a11y` as the latter has not been updated for three years and is now two major versions of `stylelint` out of date.
