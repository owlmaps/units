const UnitSocials = (props: MetaData) => {
  const { facebook, twitter, telegram, youtube, instagram, tiktok } = props;

  const _facebook = facebook
    ? <a href={facebook} className="facebook" target="_blank"></a>
    : null;
  const _twitter = twitter
    ? <a href={twitter} className="twitter" target="_blank"></a>
    : null;
  const _telegram = telegram
    ? <a href={telegram} className="telegram" target="_blank"></a>
    : null;
  const _youtube = youtube
    ? <a href={youtube} className="youtube" target="_blank"></a>
    : null;
  const _instagram = instagram
    ? <a href={instagram} className="instagram" target="_blank"></a>
    : null;
  const _tiktok = tiktok
    ? <a href={tiktok} className="tiktok" target="_blank"></a>
    : null;
  
  const hasSocials = _facebook !== null
    || _twitter !== null
    || _telegram !== null
    || _youtube !== null
    || _instagram !== null
    || _tiktok !== null;

  if (!hasSocials) {
    return null;
  }

  return (
    <div className="unit-socials">
      <div className="unit-socials__inner">{_facebook}{_twitter}{_telegram}{_youtube}{_instagram}{_tiktok}</div>
    </div>
  )

}

export default UnitSocials;