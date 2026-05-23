import React, { memo, useState } from "react";
import VinScanner from "../../VinScanner";
import CarSeerUpload from "../CarSeerUpload";
import {
  Section,
  InputContainer,
  StyledLabel,
  StyledInput,
  StyledSelect,
  StyledCheckbox,
  SmallButton,
} from "../PostProductStyles";

const BasicInfo = ({
  car,
  carMakes,
  isLoadingVin,
  isLoadingModel,
  showScanner,
  fields,
  handleInputChange,
  fetchVinDetails,
  fetchModelLookup,
  setShowScanner,
  handleCarSeerData,
  startRemoteScan,
}) => {
  const [modelQuery, setModelQuery] = useState("");

  return (
    <Section>
      <div style={{ gridColumn: "1 / -1", display: 'flex', gap: '16px', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Primary Identity</h3>
        <CarSeerUpload onParsedData={handleCarSeerData} />
      </div>

      {/* ══════ MODEL SEARCH BAR ══════ */}
      <div style={{
        gridColumn: "1 / -1",
        display: 'flex',
        gap: '12px',
        background: '#f0f9ff',
        padding: '16px',
        borderRadius: '0px',
        border: '2px solid #bae6fd',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: 'fit-content',
        }}>
          <span style={{ fontSize: '1.1rem' }}>🔍</span>
          <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Model Search
          </span>
        </div>
        <StyledInput
          type="text"
          value={modelQuery}
          onChange={(e) => setModelQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && modelQuery.trim()) {
              fetchModelLookup(modelQuery.trim());
            }
          }}
          placeholder='Search by model (e.g. "Corolla LE 2020", "BMW X5 2022")...'
          style={{
            flex: 1,
            border: '1px solid #7dd3fc',
            background: '#fff',
            margin: 0,
          }}
        />
        <SmallButton
          type="button"
          onClick={() => modelQuery.trim() && fetchModelLookup(modelQuery.trim())}
          disabled={isLoadingModel || !modelQuery.trim()}
          style={{
            background: isLoadingModel ? '#94a3b8' : '#0284c7',
            color: '#fff',
            borderColor: isLoadingModel ? '#94a3b8' : '#0284c7',
            padding: '10px 20px',
            minWidth: '120px',
          }}
        >
          {isLoadingModel ? "⏳ Looking up..." : "🚀 Lookup"}
        </SmallButton>
      </div>

      {/* ══════ DATA INGESTION TOOLBAR ══════ */}
      <div style={{ gridColumn: "1 / -1", display: 'flex', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '0px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <h4 style={{ margin: 0, color: '#475569', display: 'flex', alignItems: 'center', width: '120px' }}>Data Ingestion</h4>
        <SmallButton onClick={() => fetchVinDetails()} disabled={isLoadingVin} style={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}>
          {isLoadingVin ? "⏳ Running Pipeline..." : "⚡ Auto-Decode VIN"}
        </SmallButton>
        <SmallButton onClick={startRemoteScan} style={{ background: "#faf5ff", color: "#7c3aed", borderColor: "#ddd6fe" }}>
          📱 Remote Phone Scan
        </SmallButton>
      </div>

      {/* ══════ PRICING INTEL BANNER ══════ */}
      {car._pricingIntel && (
        <div style={{
          gridColumn: "1 / -1",
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: car._pricingIntel.statusLevel === 'HOT' ? '#f0fdf4' : car._pricingIntel.statusLevel === 'HOLD' ? '#fef2f2' : '#fffbeb',
          padding: '20px',
          borderRadius: '0px',
          border: `2px solid ${car._pricingIntel.statusLevel === 'HOT' ? '#86efac' : car._pricingIntel.statusLevel === 'HOLD' ? '#fca5a5' : '#fde68a'}`,
        }}>
          {/* Main Indicators Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</div>
              <div style={{
                fontSize: '1.2rem', fontWeight: 900,
                color: car._pricingIntel.statusLevel === 'HOT' ? '#16a34a' : car._pricingIntel.statusLevel === 'HOLD' ? '#dc2626' : '#d97706',
              }}>
                {car._pricingIntel.statusLevel === 'HOT' ? '🔥' : car._pricingIntel.statusLevel === 'HOLD' ? '🛑' : '⚡'} {car._pricingIntel.statusLevel}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Suggested</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{car._pricingIntel.suggestedPrice?.toLocaleString()} JOD</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Floor</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626' }}>{car._pricingIntel.priceFloor?.toLocaleString()} JOD</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ceiling</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>{car._pricingIntel.priceCeiling?.toLocaleString()} JOD</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Profit</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{car._pricingIntel.projectedProfit?.toLocaleString()} JOD ({car._pricingIntel.profitMarginPct}%)</div>
            </div>
          </div>

          {/* Fahas Condition Tiers Visual Comparison */}
          {car._pricingIntel.tiers && (
            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Fahas Tier Valuation Suggestions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {Object.entries(car._pricingIntel.tiers).map(([tierName, tierData]) => {
                  const isActive = car.condition === tierName;
                  return (
                    <div
                      key={tierName}
                      style={{
                        padding: '12px',
                        border: isActive ? '2px solid #0f172a' : '1px solid #cbd5e1',
                        background: isActive ? '#f8fafc' : '#ffffff',
                        borderRadius: '0px',
                        textAlign: 'center',
                        boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isActive ? '#0f172a' : '#64748b' }}>
                        {tierName} {isActive && "🎯"}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: isActive ? '#0f172a' : '#334155', marginTop: '4px' }}>
                        {tierData.suggestedPrice?.toLocaleString()} JOD
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                        Floor: {tierData.priceFloor?.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fuel Type Sensitivity Risk Warnings */}
          {car._pricingIntel.dealerIntel?.fuelRisk && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '0px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid',
              background: car._pricingIntel.dealerIntel.fuelRisk.includes('SAFE HAVEN')
                ? '#f0fdf4'
                : car._pricingIntel.dealerIntel.fuelRisk.includes('HIGH VOLATILITY')
                  ? '#fef2f2'
                  : car._pricingIntel.dealerIntel.fuelRisk.includes('DEPRECIATING ASSET')
                    ? '#fffbeb'
                    : '#f8fafc',
              borderColor: car._pricingIntel.dealerIntel.fuelRisk.includes('SAFE HAVEN')
                ? '#bbf7d0'
                : car._pricingIntel.dealerIntel.fuelRisk.includes('HIGH VOLATILITY')
                  ? '#fecaca'
                  : car._pricingIntel.dealerIntel.fuelRisk.includes('DEPRECIATING ASSET')
                    ? '#fef3c7'
                    : '#e2e8f0',
              color: car._pricingIntel.dealerIntel.fuelRisk.includes('SAFE HAVEN')
                ? '#166534'
                : car._pricingIntel.dealerIntel.fuelRisk.includes('HIGH VOLATILITY')
                  ? '#991b1b'
                  : car._pricingIntel.dealerIntel.fuelRisk.includes('DEPRECIATING ASSET')
                    ? '#92400e'
                    : '#475569',
            }}>
              <span style={{ fontSize: '1.2rem' }}>
                {car._pricingIntel.dealerIntel.fuelRisk.includes('SAFE HAVEN') ? '🛡️' :
                 car._pricingIntel.dealerIntel.fuelRisk.includes('HIGH VOLATILITY') ? '⚠️' :
                 car._pricingIntel.dealerIntel.fuelRisk.includes('DEPRECIATING ASSET') ? '⛽' : 'ℹ️'}
              </span>
              <div>
                <span style={{ fontWeight: 800 }}>Fuel Sensitivity Analysis: </span>
                {car._pricingIntel.dealerIntel.fuelRisk}
              </div>
            </div>
          )}
        </div>
      )}

      {fields.map((field, index) => {
        if (field.type === "select" && field.key === "carMake") {
          return (
            <InputContainer key={index}>
              <StyledLabel htmlFor={field.key}>{field.label}</StyledLabel>
              <StyledSelect
                id={field.key}
                value={car[field.key] || ""}
                onChange={(e) => handleInputChange(e, null, null, field.key)}
              >
                <option value="">Select Car Make</option>
                {carMakes.map((make) => (
                  <option key={make._id} value={make.title}>
                    {make.title}
                  </option>
                ))}
              </StyledSelect>
            </InputContainer>
          );
        }

        if (field.type === "select" && field.key === "condition") {
          return (
            <InputContainer key={index}>
              <StyledLabel htmlFor={field.key}>{field.label}</StyledLabel>
              <StyledSelect
                id={field.key}
                value={car[field.key] || ""}
                onChange={(e) => handleInputChange(e, null, null, field.key)}
              >
                <option value="">Select Condition (Fahas)</option>
                <option value="4 Good">4 Good (Baseline / 1.00)</option>
                <option value="2 Good">2 Good (Acceptable Mudarb / 0.90)</option>
                <option value="Rasiy">Rasiy / Koms (Chassis Damage / 0.70)</option>
                <option value="Salvage">Salvage / Ghareeq (Total Loss / 0.50)</option>
              </StyledSelect>
            </InputContainer>
          );
        }

        if (field.type === "boolean") {
          return (
            <div key={index} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
              <StyledCheckbox
                id={field.key}
                checked={!!car[field.key]}
                onChange={(e) => handleInputChange(e, null, null, field.key)}
                type="checkbox"
              />
              <StyledLabel htmlFor={field.key} style={{ marginBottom: 0 }}>
                {field.label}
              </StyledLabel>
            </div>
          );
        }

        return (
          <InputContainer key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
              <StyledLabel htmlFor={field.key} style={{ marginBottom: 0 }}>{field.label}</StyledLabel>
              {field.key === "vinNumber" && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <SmallButton
                    type="button"
                    onClick={() => fetchVinDetails()}
                    disabled={isLoadingVin}
                  >
                    {isLoadingVin ? "⏳ Pipeline Running..." : "⚡ Auto-Decode VIN"}
                  </SmallButton>
                  <SmallButton
                    type="button"
                    onClick={() => setShowScanner(true)}
                    red={true}
                  >
                    Camera Scan
                  </SmallButton>
                </div>
              )}
            </div>
            
            <StyledInput
              type={field.type === "number" ? "number" : "text"}
              id={field.key}
              value={car[field.key] || ""}
              onChange={(e) => handleInputChange(e, null, null, field.key)}
              placeholder={`Enter ${field.label}...`}
            />

            {field.key === "vinNumber" && showScanner && (
              <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                <VinScanner
                  onScan={(vin) => fetchVinDetails(vin)}
                  onClose={() => setShowScanner(false)}
                />
              </div>
            )}
          </InputContainer>
        );
      })}
    </Section>
  );
};

export default memo(BasicInfo);
