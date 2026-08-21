import { FORMULAS, JUDGMENT_RULE } from '../data/formulas'
import { expectedDamage } from '../engine/damage'
import type { PanelResult } from '../engine/calculate'
import { pct, int, dmg } from '../utils/format'

interface Props {
  result: PanelResult
}

/** 实时面板展示：战斗属性 / 三率 / 五维 / 增伤 / 期望伤害 + 判定说明 */
export default function PanelDisplay({ result }: Props) {
  const { panel: p, capped, normalized } = result
  const caps = FORMULAS.caps
  const expDmg = expectedDamage({ panel: p })

  return (
    <div className="card">
      <div className="card-title">面板 <span className="hint">{FORMULAS.version}</span></div>

      <div className="stat-section-label">战斗属性</div>
      <div className="stat-block">
        <div className="stat-item"><div className="k">外功攻击</div><div className="v">{int(p.minAtk)} ~ {int(p.maxAtk)}</div></div>
        <div className="stat-item"><div className="k">属攻</div><div className="v">{int(p.attrMinAtk)} ~ {int(p.attrMaxAtk)}</div></div>
        <div className="stat-item"><div className="k">单次期望伤害</div><div className="v cinnabar">{dmg(expDmg)}</div></div>
      </div>

      {p.minAtk > p.maxAtk && (
        <div className="warning">
          ⚡ 小外流：小外 &gt; 大外，伤害按小外结算
        </div>
      )}

      <div className="stat-section-label">三率（上限 {pct(caps.precise, 0)} / {pct(caps.crit, 0)} / {pct(caps.critLike, 0)}）</div>
      <div className="stat-block">
        <div className="stat-item">
          <div className="k">精准率</div>
          <div className="v">{pct(p.precise)} <span className="warn">（白 {pct(result.whiteRates.precise)}）</span> {capped.precise && <span className="warn">已达上限</span>}</div>
        </div>
        <div className="stat-item">
          <div className="k">会心率</div>
          <div className="v">{pct(p.crit)} <span className="warn">（白 {pct(result.whiteRates.crit)}）</span> {capped.crit && <span className="warn">已达上限</span>}</div>
        </div>
        <div className="stat-item">
          <div className="k">会意率</div>
          <div className="v">{pct(p.critLike)} <span className="warn">（白 {pct(result.whiteRates.critLike)}）</span> {capped.critLike && <span className="warn">已达上限</span>}</div>
        </div>
        <div className="stat-item"><div className="k">会心伤害加成</div><div className="v">+{pct(p.critDmg)}</div></div>
        <div className="stat-item"><div className="k">会意伤害加成</div><div className="v">+{pct(p.critLikeDmg)}</div></div>
        <div className="stat-item"><div className="k">直接会心/会意</div><div className="v">{pct(p.directCrit)} / {pct(p.directCritLike)}</div></div>
      </div>
      {normalized && (
        <div className="warning">⚠ 会心 + 会意超过 100%，已按比例归一化——{JUDGMENT_RULE.critCrowd}</div>
      )}

      <div className="stat-section-label">五维</div>
      <div className="stat-block">
        <div className="stat-item"><div className="k">劲</div><div className="v">{int(p.jin)}</div></div>
        <div className="stat-item"><div className="k">敏</div><div className="v">{int(p.min)}</div></div>
        <div className="stat-item"><div className="k">势</div><div className="v">{int(p.shi)}</div></div>
      </div>

      <div className="stat-section-label">增伤</div>
      <div className="stat-block">
        <div className="stat-item"><div className="k">全武学增伤</div><div className="v">+{pct(p.allSkillDmg)}</div></div>
        <div className="stat-item"><div className="k">武器增伤</div><div className="v">+{pct(p.weaponDmg)}</div></div>
        <div className="stat-item"><div className="k">首领增伤</div><div className="v">+{pct(p.bossDmg)}</div></div>
        <div className="stat-item"><div className="k">单体奇术增伤</div><div className="v">+{pct(p.singleQishuDmg)}</div></div>
        <div className="stat-item"><div className="k">群体奇术增伤</div><div className="v">+{pct(p.groupQishuDmg)}</div></div>
        <div className="stat-item"><div className="k">对玩家增效</div><div className="v">+{pct(p.playerDmg)}</div></div>
      </div>

      <div className="note">{JUDGMENT_RULE.order.join(' → ')} 判定：{JUDGMENT_RULE.preciseHit}</div>
    </div>
  )
}
