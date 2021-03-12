cask 'hotelier' do
  version '0.3.2'
  sha256 'bd8244acb7859a7383edf68ff774fae1140658d05e97831a73f5bfd5f68b6d43'

  url "https://github.com/macav/hotelier/releases/download/v#{version}/Hotelier-#{version}-mac.zip"
  appcast 'https://github.com/macav/hotelier/releases.atom'
  name 'Hotelier'
  homepage 'https://github.com/macav/hotelier'

  app 'Hotelier.app'
end
