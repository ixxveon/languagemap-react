import { useState } from 'react';
import PingPopLogo from '../../components/user/PingPopLogo';
import { useAuth } from '../../hooks/user/useAuth';

function ProfileSetupPage() {
    const { setupProfile, isSubmitting, errorMessage, setErrorMessage } = useAuth();
    const [form, setForm] = useState({
        birthDate: '',
        address: '',
        phoneNumber: '',
    });

    //  전화번호 하이픈 자동 포맷 처리 분리
    const formatPhoneNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length < 4) return digits;
        if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    };

    // 전화번호 입력 시 formatPhoneNumber 적용
    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({
            ...current,
            [name]: name === 'phoneNumber' ? formatPhoneNumber(value) : value,
        }));
    };

    const handleSubmit = async () => {
        await setupProfile(form);
    };



    // 기존 JSX 유지 (변경 없음)
    return (
        <section style={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            overflow: 'auto',
        }}>
            <article style={{
                background: 'var(--bg-secondary, #fff)',
                border: '1px solid var(--border, #dee2e6)',
                borderRadius: '1rem',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '560px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                }}>
                    <PingPopLogo style={{ width: '48px', height: '48px' }} />
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            프로필 입력
                        </h2>
                        <p style={{ color: 'var(--text-secondary, #6c757d)', fontSize: '0.9rem' }}>
                            학습 시작을 위해 추가 정보를 입력해주세요.
                        </p>
                    </div>
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="profile-birth">생년월일</label>
                    <input
                        id="profile-birth"
                        className="mapingo-input"
                        type="date"
                        name="birthDate"
                        value={form.birthDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="profile-address">주소</label>
                    <input
                        id="profile-address"
                        className="mapingo-input"
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="서울시 강남구"
                    />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="profile-phone">전화번호</label>
                    <input
                        id="profile-phone"
                        className="mapingo-input"
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="010-1234-5678"  
                    />
                </div>

                {errorMessage ? <p className="mapingo-form-error">{errorMessage}</p> : null}

                <button
                    type="button"
                    className="mapingo-login-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '저장 중...' : '프로필 저장하기'}
                </button>
            </article>
        </section>
    );
}

export default ProfileSetupPage; 